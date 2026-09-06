import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { DatabaseService } from './database.service';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
};

const sessionCookie = 'virtus_session';
const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

function digest(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.cookie ?? '';
  const entry = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
}

@Injectable()
export class AuthService {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ user: AuthUser; token: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.database.query<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail],
    );
    if (existing.length > 0) {
      throw new UnauthorizedException('An account with this email already exists.');
    }

    const users = await this.database.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM users',
    );
    const configuredAdmins = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    const role =
      users[0]?.count === '0' || configuredAdmins.includes(normalizedEmail) ? 'ADMIN' : 'MEMBER';
    const userRows = await this.database.query<AuthUser & { password_hash: string }>(
      'INSERT INTO users (id, email, name, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role',
      [
        randomBytes(16).toString('hex'),
        normalizedEmail,
        name.trim(),
        await hash(password, 12),
        role,
      ],
    );
    const user = userRows[0];
    if (!user) throw new UnauthorizedException('Unable to create account.');
    return { user, token: await this.createSession(user.id) };
  }

  async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    const rows = await this.database.query<AuthUser & { password_hash: string }>(
      'SELECT id, email, name, role, password_hash FROM users WHERE email = $1',
      [email.trim().toLowerCase()],
    );
    const user = rows[0];
    if (!user || !(await compare(password, user.password_hash))) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }
    return { user, token: await this.createSession(user.id) };
  }

  async currentUser(request: Request): Promise<AuthUser> {
    const token = readCookie(request, sessionCookie);
    if (!token) throw new UnauthorizedException('Sign in required.');
    const rows = await this.database.query<AuthUser>(
      `SELECT u.id, u.email, u.name, u.role
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.expires_at > NOW()`,
      [digest(token)],
    );
    const user = rows[0];
    if (!user) throw new UnauthorizedException('Session expired.');
    return user;
  }

  async logout(request: Request): Promise<void> {
    const token = readCookie(request, sessionCookie);
    if (token)
      await this.database.query('DELETE FROM sessions WHERE token_hash = $1', [digest(token)]);
  }

  setSession(response: Response, token: string): void {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    response.setHeader(
      'Set-Cookie',
      `${sessionCookie}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${sessionLifetimeSeconds}${secure}`,
    );
  }

  clearSession(response: Response): void {
    response.setHeader(
      'Set-Cookie',
      `${sessionCookie}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
    );
  }

  private async createSession(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    await this.database.query(
      "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '30 days')",
      [randomBytes(16).toString('hex'), userId, digest(token)],
    );
    return token;
  }
}
