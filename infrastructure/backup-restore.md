# Backup and Restore Baseline

Phase 0 establishes the operational requirements; it does not claim a production
backup service is configured.

## PostgreSQL

- Use encrypted, access-controlled backups in staging and production.
- Run `pg_dump` or the managed-provider equivalent on a documented schedule.
- Test restoring a backup into an isolated database before declaring it usable.
- Record retention, restore time, owner, and last successful restore in the operations memory records.

## Redis

- Treat Redis as a recoverable queue/cache dependency, not the system of record.
- Enable persistence only where queue recovery requirements justify it.
- Rebuild disposable cache state after restore; verify job idempotency before replaying work.

## Before Production

- Select the backup provider and retention policy.
- Define encryption-key ownership and rotation.
- Automate restore verification and alert on failure.
- Add the verified commands and evidence to `docs/memory/operations/`.
