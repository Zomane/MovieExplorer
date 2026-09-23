'use client'
import { useLoginUser } from "@/hooks/useUsers";
import { useAuth } from "@/providers/AuthProvider";
import { LoginDto } from "@/types/userType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import styles from './Login.module.css'
import Link from 'next/link'

export default function Login(){
    const auth = useAuth()
    const router = useRouter()
    const loginMutation = useLoginUser()
    const {register, handleSubmit, formState: {errors}, reset } = useForm<LoginDto>()

    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false)

    const onLogin: SubmitHandler<LoginDto> = (formData) => {
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

    useEffect(() => {
        if (auth.token) {
            router.replace('/profile')
        }
    }, [auth.token, router])

    return (
        <div >
            <div className={styles.loginPage}>
                <form className={styles.loginForm} onSubmit={handleSubmit(onLogin)}>
                    <h1 className={styles.loginTitle}>Вход</h1>
                    <p className={styles.subtitle}>Ваша коллекция уже ждёт вас.</p>
                    <label htmlFor="login">Логин</label>
                    <input id="login" autoComplete="username" aria-invalid={!!errors.login} aria-describedby={errors.login ? 'login-error' : undefined} className={styles.input} placeholder="Введите логин" {...register('login', {
                        required: 'Введите логин',
                        minLength: {
                            value: 5,
                            message: 'Логин должен содержать не менее 5 символов'
                        }
                    })} />

                    {errors.login && <p className={styles.errorText} id="login-error" role="alert">{errors.login.message}</p>}
                    <label htmlFor="password">Пароль</label>
                    <div className={styles.passwordField}>
                    <input id="password" autoComplete="current-password" aria-invalid={!!errors.pass} aria-describedby={errors.pass ? 'password-error' : undefined} className={styles.input} type={showPassword ? 'text' : 'password'} placeholder="Введите пароль" {...register('pass', {
                        required: 'Введите пароль',
                        minLength: {
                            value: 8, 
                            message: 'Пароль должен содержать не менее 8 символов'
                        }
                    })} />

                    <button type="button" className={styles.showPassword} onClick={() => setShowPassword(!showPassword)} aria-pressed={showPassword}>{showPassword ? 'Скрыть' : 'Показать'}</button>
                    </div>
                    {errors.pass && <p className={styles.errorText} id="password-error" role="alert">{errors.pass.message}</p>}
                    <button className={`${styles.loginBtn}`} type='submit' disabled={loginMutation.isPending}>{loginMutation.isPending? 'Вход...': 'Войти'}</button>
                    {error && <p className={styles.errorText} role="alert">{error}</p>}
                    <p className={styles.switchPage}>Нет аккаунта? <Link href="/registration">Регистрация</Link></p>

                </form>
            </div>
        </div>
    )
}
