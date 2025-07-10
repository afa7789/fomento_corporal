#!/bin/bash
# scripts/backup-db.sh
# Backup SQLite database, keep last 1 month (weekly backups)

set -e
BACKUP_DIR="$(dirname "$0")/../db_backups"
DB_FILE="$(dirname "$0")/../data.db"
DATE=$(date +"%Y-%m-%d")

mkdir -p "$BACKUP_DIR"
cp "$DB_FILE" "$BACKUP_DIR/data_$DATE.db"

# Remove backups older than 31 days
find "$BACKUP_DIR" -name 'data_*.db' -mtime +31 -delete

echo "Backup completed: $BACKUP_DIR/data_$DATE.db"
