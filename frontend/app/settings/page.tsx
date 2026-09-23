'use client'

import styles from './Settings.module.css'  
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { useChangeLogin, useChangePass, useDeleteUser } from '@/hooks/useUsers'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    const [loginMessage, setLoginMessage] = useState('')
    const [passMessage, setPassMessage] = useState('')

    const [loginMessageType, setLoginMessageType] = useState<'success' | 'error' | null>(null)
    const [passMessageType, setPassMessageType] = useState<'success' | 'error' | null>(null)

    const [isModalVisible, setIsModalVisible] = useState(false)
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (isModalVisible) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [isModalVisible])

    const {register: registerLogin, handleSubmit: handleSubmitLogin, formState: {errors: errorsLogin}, reset: resetLogin} = useForm<ChangeLoginForm>()
    const {register: registerPass, handleSubmit: handleSubmitPass, formState: {errors: errorsPass}, reset: resetPass } = useForm<ChangePassForm>()

    const loginMutation = useChangeLogin(auth.token ?? '')
    const passMutation = useChangePass(auth.token ?? '')
    const deleteMutation = useDeleteUser(auth.token ?? '')

    const onLoginChange: SubmitHandler<ChangeLoginForm> = (formData) => {
        setLoginMessage('')
        loginMutation.mutate( formData, {
            onError: (error) => {
                setLoginMessage(error.message)
                setLoginMessageType('error')

            },
            onSuccess: (data) => {
                auth.updateUser(data)
                setLoginMessage('Логин успешно изменён')
                setLoginMessageType('success')

                resetLogin()
            }
        })
    }

    const onPassChange: SubmitHandler<ChangePassForm> = (formData) => {
        setPassMessage('')
        passMutation.mutate(formData, {
            onError: (error) => {
                setPassMessage(error.message)
                setPassMessageType('error')

            },
            onSuccess: () => {
                setPassMessage('Пароль успешно изменён')
                setPassMessageType('success')

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

    if(!auth.token || !auth.user) {
        return (
            <div className={styles.tokenError}>
                <h1>Необходимо войти в аккаунт</h1>
                <Link href="/login">Войти</Link>
            </div>
        )
    }

    return (
    <div className={styles.settingsPage}>
        <div className={styles.settings}>
            <div className={styles.settingsHeader}>
                <Link href="/profile" className={styles.backLink}>← К моей коллекции</Link>
                <span className={styles.eyebrow}>ЛИЧНЫЙ КАБИНЕТ</span>
                <h1>Настройки аккаунта</h1>
                <p>Ваш профиль, безопасность и доступ к любимому кино.</p>
            </div>

            <div className={styles.settingsGrid}>
                <form className={styles.settingsCard} onSubmit={handleSubmitLogin(onLoginChange)}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                            </svg>
                        </span>
                        <span className={styles.cardLabel}>ПРОФИЛЬ</span>
                        <h2>Логин</h2>
                        <p>Измените публичное имя вашего аккаунта</p>
                    </div>
                    <p className={styles.currentLogin}>Сейчас вы <strong>{auth.user.login}</strong></p>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="login">Новый логин</label>
                        <input id="login" autoComplete="username" aria-invalid={!!errorsLogin.login} aria-describedby={errorsLogin.login ? 'login-error' : undefined} className={styles.formInput} placeholder="Введите новый логин" {...registerLogin('login', {
                                required: 'Введите новый логин',
                                minLength: {
                                    value: 5,
                                    message: 'Логин должен содержать не менее 5 символов'
                                }
                            })}/>
                    </div>

                    {errorsLogin.login && (<p className={styles.errorText} id="login-error" role="alert">{errorsLogin.login.message}</p>)}

                    {loginMessage && (
                        <p role="status" className={loginMessageType === 'error' ? styles.errorText : styles.successText}>{loginMessage}</p>
                    )}

                    <button className={styles.submitBtn} type="submit" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? 'Сохранение...' : 'Сохранить логин'}
                    </button>
                </form>

                <form className={styles.settingsCard} onSubmit={handleSubmitPass(onPassChange)}>
                    <div className={styles.cardHeader}>
                        <span className={styles.cardIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <rect x="5" y="10" width="14" height="11" rx="3" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                            </svg>
                        </span>
                        <span className={styles.cardLabel}>БЕЗОПАСНОСТЬ</span>
                        <h2>Пароль</h2>
                        <p>Обновите пароль для входа в аккаунт</p>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="newPass">Новый пароль</label>
                        <input id="newPass" autoComplete="new-password" aria-invalid={!!errorsPass.newPass} aria-describedby={errorsPass.newPass ? 'new-password-error' : undefined} className={styles.formInput} type="password" placeholder="Введите новый пароль" {...registerPass('newPass', {
                                required: 'Введите новый пароль',
                                minLength: {
                                    value: 8,
                                    message: 'Новый пароль должен содержать не менее 8 символов'
                                }
                            })}/>
                    </div>

                    {errorsPass.newPass && <p className={styles.errorText} id="new-password-error" role="alert">{errorsPass.newPass.message}</p>}
                    <div className={styles.fieldGroup}>
                        <label htmlFor="currentPass">Текущий пароль</label>
                        <input id="currentPass" autoComplete="current-password" aria-invalid={!!errorsPass.currentPass} aria-describedby={errorsPass.currentPass ? 'current-password-error' : undefined} className={styles.formInput} type="password" placeholder="Введите текущий пароль" {...registerPass('currentPass', {
                                required: 'Введите старый пароль',
                                minLength: {
                                    value: 8,
                                    message: 'Старый пароль должен содержать не менее 8 символов'
                                }
                            })}/>
                    </div>

                    {errorsPass.currentPass && <p className={styles.errorText} id="current-password-error" role="alert">{errorsPass.currentPass.message}</p>}

                    {passMessage && (
                        <p role="status" className={passMessageType === 'error' ? styles.errorText : styles.successText}>{passMessage}</p>
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

                <button className={styles.deleteAccountBtn} onClick={() => {
                    deleteMutation.reset()
                    setIsModalVisible(true)
                }}>
                    Удалить аккаунт
                </button>
            </div>

            <dialog ref={dialogRef} className={styles.modal} onClose={() => setIsModalVisible(false)} aria-labelledby="delete-title" aria-describedby="delete-description">
                <h2 className={styles.modalTitle} id="delete-title">Удалить аккаунт?</h2>

                <p className={styles.modalText} id="delete-description">Это действие нельзя будет отменить. Все данные профиля будут удалены.</p>
                {deleteMutation.isError && <p className={styles.errorText} role="alert">{deleteMutation.error.message}</p>}

                <div className={styles.modalBtns}>
                    <button className={styles.closeBtn} autoFocus onClick={() => setIsModalVisible(false)}>Отмена</button>

                    <button className={styles.deleteBtn} onClick={deleteProfile} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
                    </button>
                </div>
            </dialog>
        </div>
    </div>
)
}
