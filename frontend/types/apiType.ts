import { type User } from "./userType"

export type SaveMovieProps = {
    token: string, 
    updateUser: (updatedUser: User) => void,
    user: User | null
}