'use client'

import { useRegisterUser } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form'
import { type RegisterDto } from "@/types/userType";

export default function Registration() {

    const registerMutation = useRegisterUser()
    const {register, handleSubmit, formState:{errors}, reset} = useForm<RegisterDto>()

    const router = useRouter()

    const [error, setError] = useState<string | null>(null)

    const onRegister: SubmitHandler<RegisterDto> = async (formData) => {
        setError(null)

        registerMutation.mutate(formData, {
            onError: (error) => {
                setError(error.message)
            },
            onSuccess: () => {
                reset()
                router.replace('/login')
            }
        })
    }

    return (
        <div className="registerPage">
            <h1>Регистрация</h1>
            <form onSubmit={handleSubmit(onRegister)}>
                <input placeholder="Введите логин" {...register('login', {
                    required: 'Введите логин',
                    minLength: {
                        value: 5,
                        message: 'Логин должен содержать не менее 5 символов'
                    }
                })}/>

                {errors.login && <h3>{errors.login?.message}</h3>}

                <input placeholder="Введите пароль" type='password' {...register('pass', {
                    required: 'Введите пароль',
                    minLength: {
                        value: 8,
                        message: 'Пароль должен содержать не менее 8 символов'
                    }
                })}/>

                {errors.pass && <h3>{errors.pass.message}</h3>} 

                <input placeholder="Введите почту" type='email' {...register('email', {
                    required: 'Введите почту',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Неверный формат почты'
                    }
                })}/>

                {errors.email && <h3>{errors.email.message}</h3>}

                <button type='submit' disabled={registerMutation.isPending}>{registerMutation.isPending?'Регистрация...':'Зарегистрироваться'}</button>

                {!registerMutation.isPending && error && <h3>{error}</h3>}
            </form>
        </div>
    )
}