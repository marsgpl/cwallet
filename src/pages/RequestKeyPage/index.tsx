import React from 'react'
import { APP_TITLE } from 'defs/app'
import { Button } from 'components/Button'
import { InputText } from 'components/InputText'
import { Icon } from 'components/Icon'
import { Tools } from 'components/Tools'
import s from './index.module.css'

export interface RequestKeyPageProps {
    onSubmit: (key: string) => void
}

export function RequestKeyPage({ onSubmit }: RequestKeyPageProps) {
    const [key, setKey] = React.useState('')

    const submit = (event: React.FormEvent) => {
        event.preventDefault()
        onSubmit(key)
    }

    const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        setKey(event.target.value)
    }

    return (
        <div className={s.Root}>
            <Icon className={s.Logo} id="logo" />

            <div className={s.Title}>
                {APP_TITLE}
            </div>

            <form
                className={s.Form}
                onSubmit={submit}
            >
                <InputText
                    leftIcon="lock"
                    inputAttrs={{
                        placeholder: 'Encryption key',
                        type: 'password',
                        autoCorrect: 'off',
                        autoComplete: 'off',
                        spellCheck: false,
                        autoFocus: true,
                        required: true,
                        onChange,
                    }}
                />

                <Button
                    className={s.Submit}
                    type="submit"
                    text="Submit"
                    wide
                />
            </form>

            <div className={s.Pad} />

            <Tools mode="topleft" />
        </div>
    )
}
