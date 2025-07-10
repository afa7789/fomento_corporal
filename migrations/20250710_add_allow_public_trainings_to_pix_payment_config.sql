-- Migration: Add allow_public_trainings to pix_payment_config
ALTER TABLE pix_payment_config ADD COLUMN allow_public_trainings INTEGER DEFAULT 1; -- 1 = permitido, 0 = desabilitado
