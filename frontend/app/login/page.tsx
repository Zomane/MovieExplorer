'use client'
import { useLoginUser } from "@/hooks/useUsers";
import { useAuth } from "@/providers/AuthProvider";
import { LoginDto } from "@/types/userType";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

export default function Login(){
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()
    const {register, handleSubmit, formState: {errors}, reset } = useForm<LoginDto>()
    const router = useRouter()
    const loginMutation = useLoginUser()
    const onLogin: SubmitHandler<LoginDto> = async (formData) => {
        setError(null)
        loginMutation.mutate(formData, {
            onError: (error) => {
                setError(error.message)
            },
            onSuccess: (data) => {
                auth.login(data.token, data.loginedUser)
                reset()
                router.replace('/profile')
            }
        })
    } 

    return (
        <div>
            <h1>Вход в аккаунт</h1>
            <form onSubmit={handleSubmit(onLogin)}>
                <input placeholder="Введите логин" {...register('login', {
                    required: 'Введите логин',
                    minLength: {
                        value: 5,
                        message: 'Логин должен быть не менее 5 символов'
                    }
                })} />

                {errors.login && <p>{errors.login.message}</p>}

                <input type='password' placeholder="Введите пароль" {...register('pass', {
                    required: 'Введите пароль',
                    minLength: {
                        value: 8, 
                        message: 'Пароль должен содержать не менее 8 символов'
                    }
                })} />

                {errors.pass && <p>{errors.pass.message}</p>}

                <button type='submit'>Войти</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    )
}