'use client'
import { useLoginUser } from "@/hooks/useUsers";
import { useAuth } from "@/providers/AuthProvider";
import { LoginDto } from "@/types/userType";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import styles from './Login.module.css'

export default function Login(){
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth()
    const {register, handleSubmit, formState: {errors}, reset } = useForm<LoginDto>()
    const router = useRouter()
    const loginMutation = useLoginUser()
    const [isVisible, setIsVisible] = useState(false)
    const formError = errors.login?.message || errors.pass?.message
    const onLogin: SubmitHandler<LoginDto> = async (formData) => {
        setError(null)
        loginMutation.mutate(formData, {
            onError: (error) => {
                setError(error.message)
                setIsVisible(true)
            },
            onSuccess: (data) => {
                auth.login(data.token, data.loginedUser)
                reset()
                router.replace('/profile')
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

    return (
        <div >
            <div className={styles.loginPage}>
                <form className={styles.loginForm} onSubmit={handleSubmit(onLogin)}>
                    <h1 className={styles.loginTitle}>Вход</h1>
                    <input className={`${styles.input}`} placeholder="Введите логин" {...register('login', {
                        required: 'Введите логин',
                        minLength: {
                            value: 5,
                            message: 'Логин должен быть не менее 5 символов'
                        }
                    })} />

                    <input className={`${styles.input}`} type='password' placeholder="Введите пароль" {...register('pass', {
                        required: 'Введите пароль',
                        minLength: {
                            value: 8, 
                            message: 'Пароль должен содержать не менее 8 символов'
                        }
                    })} />

                    {formError && <p className={`${styles.errorText}`}>{formError}</p>}
                    <button className={`${styles.loginBtn}`} type='submit' disabled={loginMutation.isPending}>{loginMutation.isPending? 'Вход...': 'Войти'}</button>
                    {error && <p className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{error}</p>}

                </form>
            </div>
        </div>
    )
}