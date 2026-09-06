import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
const redis = new Redis(redisUrl, { lazyConnect: true });

async function main(): Promise<void> {
  await redis.connect();
  await redis.ping();
  console.log('Virtus worker connected to Redis and is ready for jobs.');
}

void main().catch((error: unknown) => {
  console.error('Worker startup failed.', error);
  process.exitCode = 1;
});
