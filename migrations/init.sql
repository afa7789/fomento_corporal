-- Database initialization script for Fomento Corporal
-- SQLite database schema with all required tables

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Remove the old Admins table if it exists (for migration)
DROP TABLE IF EXISTS Admins;

-- Users table (unified for all user types)
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- bcrypt hashed
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT CHECK (type IN ('user', 'admin', 'ultimate_admin')) NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- pix payment config table
CREATE TABLE IF NOT EXISTS pix_payment_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pix_key VARCHAR(100) NOT NULL,
    beneficiary_name VARCHAR(25) NOT NULL,
    beneficiary_city VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Groups table
CREATE TABLE IF NOT EXISTS Groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- UserGroups junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS UserGroups (
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES Groups(id) ON DELETE CASCADE
);

-- TrainingInfo table
CREATE TABLE IF NOT EXISTS TrainingInfo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE RESTRICT
);

-- FileAccess table for controlling access to training files
CREATE TABLE IF NOT EXISTS FileAccess (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    training_id INTEGER NOT NULL,
    access_type TEXT CHECK (access_type IN ('everyone', 'group', 'user')) NOT NULL,
    target_id INTEGER, -- nullable, references Groups.id or Users.id depending on access_type
    FOREIGN KEY (training_id) REFERENCES TrainingInfo(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS Payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    proof_file_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE RESTRICT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON Users(username);
CREATE INDEX IF NOT EXISTS idx_users_type ON Users(type);
CREATE INDEX IF NOT EXISTS idx_usergroups_user ON UserGroups(user_id);
CREATE INDEX IF NOT EXISTS idx_usergroups_group ON UserGroups(group_id);
CREATE INDEX IF NOT EXISTS idx_fileaccess_training ON FileAccess(training_id);
CREATE INDEX IF NOT EXISTS idx_fileaccess_target ON FileAccess(target_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON Payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON Payments(status);

-- Create triggers to update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON Users
    BEGIN
        UPDATE Users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_traininginfo_timestamp 
    AFTER UPDATE ON TrainingInfo
    BEGIN
        UPDATE TrainingInfo SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_payments_timestamp 
    AFTER UPDATE ON Payments
    BEGIN
        UPDATE Payments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Insert default admin user only
-- Password hash for 'admin123' using bcrypt (CORRECTED)
INSERT OR IGNORE INTO Users (username, password, name, email, type) 
VALUES ('admin', '$2b$10$3CdDZIOPuwxH4gtbA/RGueW.kH5Eoh6YfipG4QH7s4rAQDa7662sK', 'Administrator', 'admin@fomento.com', 'admin');

-- Insert some default groups
-- INSERT OR IGNORE INTO Groups (name) VALUES ('Premium Users');
-- INSERT OR IGNORE INTO Groups (name) VALUES ('Basic Users');
-- INSERT OR IGNORE INTO Groups (name) VALUES ('Trial Users');
