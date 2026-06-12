'use client'

import styles from './Settings.module.css'  
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useChangeLogin, useChangePass } from '@/hooks/useUsers'
import { useAuth } from '@/providers/AuthProvider'

type ChangePassForm = {
    currentPass: string; 
    newPass: string;
}

type ChangeLoginForm = {
    login: string
}

export default function SettingsPage(){
    const auth = useAuth()

    if(!auth) {
        return <h1>Необходимо войти в аккаунт</h1>
    }

    const [loginMessage, setLoginMessage] = useState('')
    const [passMessage, setPassMessage] = useState('')

    const [loginMessageType, setLoginMessageType] = useState<'success' | 'error' | null>(null)
    const [passMessageType, setPassMessageType] = useState<'success' | 'error' | null>(null)

    const [isLoginVisible, setIsLoginVisible] = useState(false)
    const [isPassVisible, setIsPassVisible] = useState(false)

    const {register: registerLogin, handleSubmit: handleSubmitLogin, formState: {errors: errorsLogin}, reset: resetLogin} = useForm<ChangeLoginForm>()
    const {register: registerPass, handleSubmit: handleSubmitPass, formState: {errors: errorsPass}, reset: resetPass } = useForm<ChangePassForm>()

    const loginMutation = useChangeLogin(auth.token ?? '')
    const passMutation = useChangePass(auth.token ?? '')

    const passFormErrors = errorsPass.newPass?.message || errorsPass.currentPass?.message

    const onLoginChange: SubmitHandler<ChangeLoginForm> = (formData) => {
        loginMutation.mutate( formData, {
            onError: (error) => {
                setLoginMessage(error.message)
                setLoginMessageType('error')
                setIsLoginVisible(true)
            },
            onSuccess: (data) => {
                auth.updateUser(data)
                setLoginMessage('Логин успешно изменён')
                setLoginMessageType('success')
                setIsLoginVisible(true)
            }
        })
    }

    const onPassChange: SubmitHandler<ChangePassForm> = (formData) => {
        passMutation.mutate(formData, {
            onError: (error) => {
                setPassMessage(error.message)
                setPassMessageType('error')
                setIsPassVisible(true)
            },
            onSuccess: () => {
                setPassMessage('Пароль успешно изменён')
                setPassMessageType('success')
                setIsPassVisible(true)
            }
        })
    }

    function onDeleteProfile(){

    }

    useEffect(() => {
        if (!loginMessage) return

        const hideTimer = setTimeout(() => {
            setIsLoginVisible(false)
        }, 2000)

        const removeTimer = setTimeout(() => {
            setLoginMessage('')
            setLoginMessageType(null)
        }, 2500)

        return () => {
            clearTimeout(hideTimer)
            clearTimeout(removeTimer)
        }
    }, [loginMessage])


    useEffect(() => {
        if (!passMessage) return

        const hideTimer = setTimeout(() => {
            setIsPassVisible(false)
        }, 2000)

        const removeTimer = setTimeout(() => {
            setPassMessage('')
            setPassMessageType(null)
        }, 2500)

        return () => {
            clearTimeout(hideTimer)
            clearTimeout(removeTimer)
        }
    }, [passMessage])


    return (
        <div className={styles.settingsPage}>
            <div className={styles.settings}>
                <form onSubmit={handleSubmitLogin(onLoginChange)}>
                    <input placeholder='Введите новый логин' {...registerLogin('login', {
                        required: 'Введите новый логин',
                        minLength: {
                            value: 5,
                            message: 'Логин должен содержать не менее 5 символов'
                        }
                    })}/>
                    {errorsLogin.login && <h3 className={`${styles.errorText}`}>{errorsLogin.login.message}</h3>}
                    <button type='submit'>Изменить логин</button>
                    {loginMessage && (
                        <p className={`${loginMessageType === 'error' ? styles.errorText : styles.successText} ${!isLoginVisible ? styles.hidden : ''}`}>{loginMessage}</p>
                    )}
                </form>
                <form className='' onSubmit={handleSubmitPass(onPassChange)}>
                    <input type='password' placeholder='Введите новый пароль' {...registerPass('newPass', {
                        required: 'Введите новый пароль',
                        minLength: {
                            value: 8,
                            message: 'Новый пароль должен содержать не менее 8 символов'
                        }
                    })}/>

                    <input type='password' placeholder='Введите текущий пароль' {...registerPass('currentPass', {
                        required: 'Введите старый пароль',
                        minLength: {
                            value: 8,
                            message: 'Старый пароль должен содержать не менее 8 символов'
                        }
                    })}/>
                    {passFormErrors && <h3 className={`${styles.errorText}`}>{passFormErrors}</h3>}
                    <button type='submit'>Изменить пароль</button>
                    <p className={`${passMessage === 'error' ? styles.errorText : styles.successText} ${!isPassVisible ? styles.hidden : ''}`}>{passMessage}</p>
                </form>
                <button onClick={onDeleteProfile}>Удалить аккаунт</button>
            </div>
        </div>
    )
}
// step160105
