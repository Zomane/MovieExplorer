import { getProfile, getUserById, getUsers, loginUser, registerUser, toggleSaveMovie } from "@/api/users";
import { User } from "@/types/userType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type SaveMovieProps } from "@/types/apiType";

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
        staleTime: 500,
        refetchOnWindowFocus: false,
        retry: 3
    })
}

export function useUserById(id: string){
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
        retry: 3
    })
}


export function useToggleSaveMovie({token, updateUser, user}: SaveMovieProps){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({userId, movieId}: {userId: string, movieId: string}) => toggleSaveMovie(userId, movieId, token),
        
        onMutate: async ({movieId}) => {

            const previousUser = user

            if(previousUser){
                const savedMovieIds = previousUser.savedMovieIds ?? []
                const updatedMovieIds = savedMovieIds.includes(movieId) ? savedMovieIds.filter(id => id !== movieId): [...savedMovieIds, movieId]
                const updatedUser: User = {
                    ...previousUser,
                    savedMovieIds: updatedMovieIds
                }
                updateUser(updatedUser)
                
            }
            return {previousUser}
            
        },

        onError: (_error, _variables, context) => {
            
            if (context?.previousUser) {
                updateUser(context.previousUser)
            }
        },

        onSuccess: (serverUser) =>{
            updateUser(serverUser)
        },

        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['user', variables.userId]
            })
        }
    })
}

export function useRegisterUser() {
    const mutation = useMutation({
        mutationFn: registerUser
    })
    return mutation
}

export function useLoginUser(){
    const mutation = useMutation({
        mutationFn: loginUser
    })
    return mutation
}

export function useUserProfile(token: string){
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => getProfile(token),
        retry: 3,
        refetchOnWindowFocus: false,
        enabled: !!token    
    })
}