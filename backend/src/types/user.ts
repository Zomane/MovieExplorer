export type UserEntity = {
    id: string
    login: string
    pass: string
    role: 'user' | 'admin'
    email: string
    savedMovieIds: string[]
}