// Database types for better TypeScript support

export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Admin {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Group {
    id: number;
    name: string;
}

export interface TrainingInfo {
    id: number;
    name: string;
    file_path: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    admin_name?: string; // From JOIN queries
}

export interface FileAccess {
    id: number;
    training_id: number;
    access_type: 'everyone' | 'group' | 'user';
    target_id: number | null;
}

export interface Payment {
    id: number;
    user_id: number;
    amount: number;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    proof_file_path: string | null;
    created_at: string;
    updated_at: string;
    username?: string; // From JOIN queries
    user_name?: string; // From JOIN queries
}

export interface DatabaseResult {
    lastInsertRowid: number;
    changes: number;
}
