import { getUserById, getUsers, toggleSaveMovie } from "@/api/users";
import { User } from "@/types/userType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export function useToggleSaveMovie(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({userId, movieId}: {userId: string, movieId: string}) => toggleSaveMovie(userId, movieId),
        
        onMutate: async ({userId, movieId}) => {
            await queryClient.cancelQueries({
                queryKey: ['user', userId]
            })

            const previousUser = queryClient.getQueryData<User>(['user', userId])
            if(previousUser){
                const updatedMovieIds = previousUser.savedMovieIds.includes(movieId) ? previousUser.savedMovieIds.filter(id => id !== movieId): [...previousUser.savedMovieIds, movieId]
                queryClient.setQueryData<User>(
                    ['user', userId],
                    {
                        ...previousUser,
                        savedMovieIds: updatedMovieIds
                    }
                )
            }
            return {previousUser}
        },
        onError: (_error, variables, context) => {
            queryClient.setQueryData(['user', variables.userId], context?.previousUser)
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['user', variables.userId]
            })
        }
    })
}