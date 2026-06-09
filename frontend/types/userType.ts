export type User = {
    id: string;
    login: string;
    role: 'user' | 'admin';
    email: string;
    savedMovieIds: string[];
}

export type RegisterDto = {
    login: string,
    email: string,
    pass: string
}

export type LoginDto = {
    login: string,
    pass: string
}