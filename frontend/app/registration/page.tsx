'use client'

import { useRegisterUser } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form'
import { type RegisterDto } from "@/types/userType";
import styles from './Register.module.css'
import { useAuth } from "@/providers/AuthProvider";

export default function Registration() {
    const auth = useAuth()

    const registerMutation = useRegisterUser()
    const {register, handleSubmit, formState:{errors}, reset} = useForm<RegisterDto>()

    const router = useRouter()
    
    const [isVisible, setIsVisible] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const formError = errors.login?.message || errors.email?.message || errors.pass?.message 
    const onRegister: SubmitHandler<RegisterDto> = async (formData) => {
        setError(null)

        registerMutation.mutate(formData, {
            onError: (error) => {
                setError(error.message)
                setIsVisible(true)
            },
            onSuccess: () => {
                reset()
                router.replace('/login')
            }
        })
    }

    useEffect(() => {
        if(!error) return
        const timer = setTimeout(()=>{
            setError(null)
        }, 2500)

        return () => clearTimeout(timer)
    }, [error])

    useEffect(() => {
        if (auth.token) {
            router.replace('/profile')
        }
    }, [auth.token, router])

    return (
        <div className={styles.registerPage}>

            <form className={styles.registerForm} onSubmit={handleSubmit(onRegister)}>
                <h1 className={styles.registerTitle}>Регистрация</h1>
                <input className={`${styles.input}`} placeholder="Введите логин" {...register('login', {
                    required: 'Введите логин',
                    minLength: {
                        value: 5,
                        message: 'Логин должен содержать не менее 5 символов'
                    }
                })}/>

                <input className={`${styles.input}`} placeholder="Введите пароль" type='password' {...register('pass', {
                    required: 'Введите пароль',
                    minLength: {
                        value: 8,
                        message: 'Пароль должен содержать не менее 8 символов'
                    }
                })}/>

                <input className={`${styles.input}`} placeholder="Введите почту" type='email' {...register('email', {
                    required: 'Введите почту',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Неверный формат почты'
                    }
                })}/>

                {formError && <p className={styles.errorText}>{formError}</p>}

                <button type='submit' className={`${styles.registerBtn} `} disabled={registerMutation.isPending}>{registerMutation.isPending?'Регистрация...':'Зарегистрироваться'}</button>

                {!registerMutation.isPending && error && <p className={styles.errorText}>{error}</p>}
            </form>
        </div>
    )
}