// Database types for better TypeScript support

export type UserType = 'user' | 'admin' | 'ultimate_admin';

export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    type: UserType;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Keep Admin interface for backward compatibility (will be removed gradually)
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
    creator_name?: string; // From JOIN queries (updated from admin_name)
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
    info?: string | null; // Campo de observação/comentário
    created_at: string;
    updated_at: string;
    username?: string; // From JOIN queries
    user_name?: string; // From JOIN queries
}

export interface DatabaseResult {
    lastInsertRowid: number;
    changes: number;
}
