-- Migration: Add is_public column to TrainingInfo
ALTER TABLE TrainingInfo ADD COLUMN is_public INTEGER DEFAULT 0;
