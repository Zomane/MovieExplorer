'use client'

import { useRegisterUser } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form'
import { type RegisterDto } from "@/types/userType";
import styles from './Register.module.css'
import { useAuth } from "@/providers/AuthProvider";
import Link from 'next/link'

export default function Registration() {
    const auth = useAuth()

    const registerMutation = useRegisterUser()
    const {register, handleSubmit, formState:{errors}, reset} = useForm<RegisterDto>()

    const router = useRouter()
    
    const [showPassword, setShowPassword] = useState(false)
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

    useEffect(() => {
        if (auth.token) {
            router.replace('/profile')
        }
    }, [auth.token, router])

    return (
        <div className={styles.registerPage}>

            <form className={styles.registerForm} onSubmit={handleSubmit(onRegister)}>
                <h1 className={styles.registerTitle}>Регистрация</h1>
                <p className={styles.subtitle}>Соберите свою коллекцию любимого кино.</p>
                <label htmlFor="login">Логин</label>
                <input id="login" autoComplete="username" aria-invalid={!!errors.login} aria-describedby={errors.login ? 'login-error' : undefined} className={styles.input} placeholder="Не менее 5 символов" {...register('login', {
                    required: 'Введите логин',
                    minLength: {
                        value: 5,
                        message: 'Логин должен содержать не менее 5 символов'
                    }
                })}/>

                {errors.login && <p className={styles.errorText} id="login-error" role="alert">{errors.login.message}</p>}
                <label htmlFor="password">Пароль</label>
                <div className={styles.passwordField}>
                <input id="password" autoComplete="new-password" aria-invalid={!!errors.pass} aria-describedby={errors.pass ? 'password-error' : undefined} className={styles.input} placeholder="Не менее 8 символов" type={showPassword ? 'text' : 'password'} {...register('pass', {
                    required: 'Введите пароль',
                    minLength: {
                        value: 8,
                        message: 'Пароль должен содержать не менее 8 символов'
                    }
                })}/>

                <button type="button" className={styles.showPassword} onClick={() => setShowPassword(!showPassword)} aria-pressed={showPassword}>{showPassword ? 'Скрыть' : 'Показать'}</button>
                </div>
                {errors.pass && <p className={styles.errorText} id="password-error" role="alert">{errors.pass.message}</p>}
                <label htmlFor="email">Почта</label>
                <input id="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} className={styles.input} placeholder="you@example.com" type="email" {...register('email', {
                    required: 'Введите почту',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Неверный формат почты'
                    }
                })}/>

                {errors.email && <p className={styles.errorText} id="email-error" role="alert">{errors.email.message}</p>}

                <button type='submit' className={`${styles.registerBtn} `} disabled={registerMutation.isPending}>{registerMutation.isPending?'Регистрация...':'Зарегистрироваться'}</button>

                {!registerMutation.isPending && error && <p className={styles.errorText} role="alert">{error}</p>}
                <p className={styles.switchPage}>Уже есть аккаунт? <Link href="/login">Войти</Link></p>
            </form>
        </div>
    )
}
