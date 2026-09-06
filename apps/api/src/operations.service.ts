import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { DatabaseService } from './database.service';
import type { AuthUser } from './auth.service';

function id(): string {
  return randomBytes(16).toString('hex');
}

@Injectable()
export class OperationsService {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}

  async overview() {
    const [metrics, projects, approvals, engines] = await Promise.all([
      this.database.query<{
        clients: string;
        projects: string;
        approvals: string;
        outstandingCents: string;
      }>(
        `SELECT
           (SELECT COUNT(*)::text FROM clients) AS clients,
           (SELECT COUNT(*)::text FROM projects) AS projects,
           (SELECT COUNT(*)::text FROM approvals WHERE status = 'PENDING') AS approvals,
           COALESCE((SELECT SUM(amount_cents) FROM invoices WHERE status <> 'PAID'), 0)::text AS "outstandingCents"`,
      ),
      this.database.query(
        'SELECT id, name, client_name AS client, engine, progress, due_date AS due, owner_initials AS owner FROM projects ORDER BY due_date ASC LIMIT 6',
      ),
      this.database.query(
        `SELECT id, title, context, requested_at AS requested, owner_initials AS owner, engine, status
         FROM approvals WHERE status = 'PENDING' ORDER BY requested_at DESC LIMIT 5`,
      ),
      this.database.query<{ engine: string; count: string }>(
        'SELECT engine, COUNT(*)::text AS count FROM projects GROUP BY engine ORDER BY engine',
      ),
    ]);
    const summary = metrics[0];
    return {
      metrics: {
        clients: Number(summary?.clients ?? 0),
        projects: Number(summary?.projects ?? 0),
        approvals: Number(summary?.approvals ?? 0),
        outstandingCents: Number(summary?.outstandingCents ?? 0),
      },
      engines: engines.map((item) => ({ name: item.engine, count: Number(item.count) })),
      projects,
      approvals,
    };
  }

  clients() {
    return this.database.query(
      'SELECT id, name, relationship_type AS "type", owner_name AS owner, value_cents AS "valueCents", health FROM clients ORDER BY created_at DESC',
    );
  }

  projects() {
    return this.database.query(
      'SELECT id, name, client_name AS client, engine, progress, due_date AS due, owner_initials AS owner FROM projects ORDER BY due_date ASC',
    );
  }

  files() {
    return this.database.query(
      'SELECT id, name, file_type AS "type", owner_initials AS owner, updated_at AS updated FROM files ORDER BY updated_at DESC',
    );
  }

  approvals() {
    return this.database.query(
      'SELECT id, title, context, requested_at AS requested, owner_initials AS owner, engine, status FROM approvals ORDER BY requested_at DESC',
    );
  }

  invoices() {
    return this.database.query(
      'SELECT id, invoice_number AS number, client_name AS client, description, amount_cents AS "amountCents", status, due_date AS due FROM invoices ORDER BY due_date ASC',
    );
  }

  async applications(user: AuthUser) {
    this.requireAdmin(user);
    return this.database.query(
      `SELECT id, email, name, preferred_engine AS engine, passions, other_passion AS "otherPassion", bio,
              portfolio, status, assigned_engine AS "assignedEngine", admin_note AS "adminNote", submitted_at AS "submittedAt"
       FROM team_applications ORDER BY submitted_at DESC`,
    );
  }

  async createApplication(
    user: AuthUser,
    body: {
      name: string;
      engine: string;
      passions: string[];
      otherPassion?: string;
      bio: string;
      portfolio?: string;
    },
  ) {
    const rows = await this.database.query(
      `INSERT INTO team_applications
       (id, user_id, email, name, preferred_engine, passions, other_passion, bio, portfolio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name, preferred_engine = EXCLUDED.preferred_engine,
       passions = EXCLUDED.passions, other_passion = EXCLUDED.other_passion, bio = EXCLUDED.bio,
       portfolio = EXCLUDED.portfolio, updated_at = NOW()
       RETURNING id, email, name, preferred_engine AS engine, passions, other_passion AS "otherPassion", bio,
       portfolio, status, assigned_engine AS "assignedEngine", admin_note AS "adminNote", submitted_at AS "submittedAt"`,
      [
        id(),
        user.id,
        user.email,
        body.name,
        body.engine,
        JSON.stringify(body.passions),
        body.otherPassion ?? '',
        body.bio,
        body.portfolio ?? '',
      ],
    );
    return rows[0];
  }

  async myApplication(user: AuthUser) {
    const rows = await this.database.query(
      `SELECT id, email, name, preferred_engine AS engine, passions, other_passion AS "otherPassion", bio,
              portfolio, status, assigned_engine AS "assignedEngine", admin_note AS "adminNote", submitted_at AS "submittedAt"
       FROM team_applications WHERE user_id = $1`,
      [user.id],
    );
    return rows[0] ?? null;
  }

  async updateApplication(user: AuthUser, applicationId: string, body: Record<string, unknown>) {
    this.requireAdmin(user);
    const rows = await this.database.query(
      `UPDATE team_applications SET status = COALESCE($1, status), assigned_engine = COALESCE($2, assigned_engine),
       admin_note = COALESCE($3, admin_note), updated_at = NOW() WHERE id = $4
       RETURNING id, status, assigned_engine AS "assignedEngine", admin_note AS "adminNote"`,
      [body.status ?? null, body.assignedEngine ?? null, body.adminNote ?? null, applicationId],
    );
    if (!rows[0]) throw new NotFoundException('Application not found.');
    return rows[0];
  }

  async updateApproval(user: AuthUser, approvalId: string, status: string) {
    this.requireAdmin(user);
    const rows = await this.database.query(
      'UPDATE approvals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status',
      [status, approvalId],
    );
    if (!rows[0]) throw new NotFoundException('Approval not found.');
    return rows[0];
  }

  private requireAdmin(user: AuthUser): void {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required.');
  }
}
