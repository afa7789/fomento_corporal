# Monitoring and Maintenance Plan

## Logging
- All errors and user actions are logged to `logs/app.log` using `src/lib/logger.ts`.
- Review logs regularly for unusual activity or errors.

## Database Backups
- Run `scripts/backup-db.sh` manually or via cron once a week (recommended: every Sunday night).
- Backups are stored in `db_backups/` and kept for 1 month (older backups are deleted automatically).

### Example: Schedule Weekly Backup with Cron (Linux)

1. Abra o crontab do usuário do projeto:
   ```bash
   crontab -e
   ```
2. Adicione a linha abaixo para rodar o backup todo domingo às 23h59:
   ```cron
   59 23 * * 0 /bin/bash /caminho/para/seu/projeto/scripts/backup-db.sh
   ```
   > Substitua `/caminho/para/seu/projeto/` pelo caminho real do seu projeto.

3. Salve e feche o editor. O backup será feito automaticamente toda semana.

## Application Updates
- Check for dependency and SvelteKit updates monthly.
- Run `bun upgrade` and review release notes.
- Test thoroughly before deploying updates to production.

---

**Checklist (Monthly):**
- [ ] Run database backup (ou conferir se o cron está funcionando)
- [ ] Review logs for errors
- [ ] Check for and apply updates
- [ ] Test application after updates
