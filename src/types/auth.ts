
export type UserRole = "admin" | "teacher" | "student" | "parent" | "staff";

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	avatar?: string;
	isActive: boolean;
	lastLogin?: Date;
	emailVerified: boolean;
	adminVerified: boolean;
}

export interface AuthResponse {
	user: User;
	token: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
	role?: UserRole; // Added role as an optional property
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	isAdminVerified: boolean;
}

export interface AdminVerificationCode {
	code: string;
	userId: string;
	userEmail: string;
	userName: string;
	createdAt: Date;
	used: boolean;
}
