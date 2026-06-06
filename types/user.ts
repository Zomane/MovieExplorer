export type User = {
    id: string;
    login: string;
    pass: string;
    role: 'user' | 'admin';
    email: string;
}