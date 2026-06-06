import { getUserById, getUsers } from "@/api/users";
import { useQuery, useMutation } from "@tanstack/react-query";

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