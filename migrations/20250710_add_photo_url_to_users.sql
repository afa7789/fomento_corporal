-- Migration: Add photo_url to Users
ALTER TABLE Users ADD COLUMN photo_url TEXT;
