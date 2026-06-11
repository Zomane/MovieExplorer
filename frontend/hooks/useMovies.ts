import { getMovieById, getMovies, getSavedMovies } from "@/api/movies";
import { useQuery, useMutation } from "@tanstack/react-query";

export function useMovies(){
    return useQuery({
        queryKey: ['movies'], 
        queryFn: getMovies,
        retry: 3,
        staleTime: 500
    })
}

export function useMovieByid(id: string){
    return useQuery({
        queryKey: ['movie', id],
        queryFn: () => getMovieById(id),
        enabled: !!id,
        retry: 3
    })
}

export function useProfileMovies(id: string){
    return useQuery({
        queryKey: ['savedMovies', id],
        queryFn: () => getSavedMovies(id),
        retry: 3, 
        enabled: !!id
    })
}