'use client'

import { LoginDto } from '@/types/userType'
import styles from './Settings.module.css'  
import { useFieldArray, useForm } from 'react-hook-form'
import { useState } from 'react'

type ChangePassForm = {
    newPass: string,
    oldPass: string
}

export default function SettingsPage(){
    const [isVisible, setIsVisible] = useState(false)
    const {register: registerLogin, handleSubmit: handleSubmitLogin, formState: {errors: errorsLogin}, reset: resetLogin} = useForm<{login: string}>()
    const {register: registerPass, handleSubmit: handleSubmitPass, formState: {errors: errorsPass}, reset: resetPass } = useForm<ChangePassForm>()

    const passFormErrors = errorsPass.oldPass?.message || errorsPass.newPass?.message

    function onLoginChange(){
        
    }
    
    function onPassChange(){

    }

    return (
        <div className={styles.settingsPage}>
            <div className={styles.settings}>
                <form onSubmit={handleSubmitLogin(onLoginChange)}>
                    <input placeholder='Введите логин' {...registerLogin('login', {
                        required: 'Введите новый логин',
                        minLength: {
                            value: 5,
                            message: 'Логин должен содержать не менее 5 символов'
                        }
                    })}/>
                    {errorsLogin.login && <h3>{errorsLogin.login.message}</h3>}
                    <button type='submit'>Изменить логин</button>
                </form>
                <form className='' onSubmit={handleSubmitPass(onPassChange)}>
                    <input type='password' placeholder='Введите пароль' {...registerPass('newPass', {
                        required: 'Введите новый пароль',
                        minLength: {
                            value: 5,
                            message: 'Новый пароль должен содержать не менее 8 символов'
                        }
                    })}/>

                    <input type='password' placeholder='Введите пароль' {...registerPass('oldPass', {
                        required: 'Введите старый пароль',
                        minLength: {
                            value: 8,
                            message: 'Старый пароль должен содержать не менее 8 символов'
                        }
                    })}/>
                    {passFormErrors && <h3 className={`${styles.errorText} ${!isVisible?styles.hidden:''}`}>{passFormErrors}</h3>}
                    <button type='submit'>Изменить пароль</button>
                </form>
                <button>Удалить аккаунт</button>
            </div>
        </div>
    )
}