export interface Usuario {
	id: string;
	username: string | null;
	full_name: string | null;
	avatar_url: string | null;
	updated_at: string | null;
	role: string;
	icon: string | null;
	email?: string | null;
	fullName?: string | null;
	avatarUrl?: string | null;
}

export interface SignUpData {
	email: string;
	password: string;
	username: string;
	fullName: string;
	avatarUrl?: string;
	icon?: string;
}

export interface SignInData {
	email: string;
	password: string;
}

export interface AuthResponse<T = undefined> {
	success: boolean;
	message?: string;
	error?: string;
	data?: T;
}
