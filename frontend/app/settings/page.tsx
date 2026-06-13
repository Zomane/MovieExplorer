'use client'

import styles from './Settings.module.css'  
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useChangeLogin, useChangePass, useDeleteUser } from '@/hooks/useUsers'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'

type ChangePassForm = {
    currentPass: string; 
    newPass: string;
}

type ChangeLoginForm = {
    login: string
}

export default function SettingsPage(){
    const auth = useAuth()
    const router = useRouter()

    if(!auth) {
        return <h1>Необходимо войти в аккаунт</h1>
    }

    const [loginMessage, setLoginMessage] = useState('')
    const [passMessage, setPassMessage] = useState('')

    const [loginMessageType, setLoginMessageType] = useState<'success' | 'error' | null>(null)
    const [passMessageType, setPassMessageType] = useState<'success' | 'error' | null>(null)

    const [isLoginVisible, setIsLoginVisible] = useState(false)
    const [isPassVisible, setIsPassVisible] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const {register: registerLogin, handleSubmit: handleSubmitLogin, formState: {errors: errorsLogin}, reset: resetLogin} = useForm<ChangeLoginForm>()
    const {register: registerPass, handleSubmit: handleSubmitPass, formState: {errors: errorsPass}, reset: resetPass } = useForm<ChangePassForm>()

    const loginMutation = useChangeLogin(auth.token ?? '')
    const passMutation = useChangePass(auth.token ?? '')
    const deleteMutation = useDeleteUser(auth.token ?? '')

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
                resetLogin()
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
                resetPass()
            }
        })
    }

    function deleteProfile(){
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                setIsModalVisible(false)
                auth.logout()
                router.replace('/login')
            }
        })
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
            <div className={styles.settingsHeader}>
                <h1>Настройки аккаунта</h1>
                <p>Изменение логина и пароля</p>
            </div>

            <div className={styles.settingsGrid}>
                <form className={styles.settingsCard} onSubmit={handleSubmitLogin(onLoginChange)}>
                    <div className={styles.cardHeader}>
                        <h2>Логин</h2>
                        <p>Измените публичное имя вашего аккаунта</p>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="login">Новый логин</label>
                        <input id="login" className={styles.formInput} placeholder="Введите новый логин" {...registerLogin('login', {
                                required: 'Введите новый логин',
                                minLength: {
                                    value: 5,
                                    message: 'Логин должен содержать не менее 5 символов'
                                }
                            })}/>
                    </div>

                    {errorsLogin.login && (<p className={styles.errorText}>{errorsLogin.login.message}</p>)}

                    {loginMessage && (
                        <p className={`${loginMessageType === 'error' ? styles.errorText : styles.successText} ${!isLoginVisible ? styles.hidden : ''}`}>{loginMessage}</p>
                    )}

                    <button className={styles.submitBtn} type="submit" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? 'Сохранение...' : 'Сохранить логин'}
                    </button>
                </form>

                <form className={styles.settingsCard} onSubmit={handleSubmitPass(onPassChange)}>
                    <div className={styles.cardHeader}>
                        <h2>Пароль</h2>
                        <p>Обновите пароль для входа в аккаунт</p>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="newPass">Новый пароль</label>
                        <input id="newPass" className={styles.formInput} type="password" placeholder="Введите новый пароль" {...registerPass('newPass', {
                                required: 'Введите новый пароль',
                                minLength: {
                                    value: 8,
                                    message: 'Новый пароль должен содержать не менее 8 символов'
                                }
                            })}/>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="currentPass">Текущий пароль</label>
                        <input id="current" className={styles.formInput} type="password" placeholder="Введите текущий пароль" {...registerPass('currentPass', {
                                required: 'Введите старый пароль',
                                minLength: {
                                    value: 8,
                                    message: 'Старый пароль должен содержать не менее 8 символов'
                                }
                            })}/>
                    </div>

                    {passFormErrors && (
                        <p className={styles.errorText}>{passFormErrors}</p>
                    )}

                    {passMessage && (
                        <p className={`${passMessageType === 'error' ? styles.errorText : styles.successText} ${!isPassVisible ? styles.hidden : ''}`}>{passMessage}</p>
                    )}

                    <button className={styles.submitBtn} type="submit" disabled={passMutation.isPending}>
                        {passMutation.isPending ? 'Сохранение...' : 'Сохранить пароль'}
                    </button>
                </form>
            </div>

            <div className={styles.deleteZone}>
                <div>
                    <h2>Удалить аккаунт</h2>
                    <p>После удаления аккаунта восстановить профиль будет невозможно</p>
                </div>

                <button className={styles.deleteAccountBtn} onClick={() => setIsModalVisible(true)}>
                    Удалить аккаунт
                </button>
            </div>

            {isModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalTitle}>Удалить аккаунт?</h2>

                        <p className={styles.modalText}>Это действие нельзя будет отменить. Все данные профиля будут удалены.</p>

                        <div className={styles.modalBtns}>
                            <button className={styles.closeBtn} onClick={() => setIsModalVisible(false)}>Отмена</button>

                            <button className={styles.deleteBtn} onClick={deleteProfile} disabled={deleteMutation.isPending}>
                                {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
)
}

