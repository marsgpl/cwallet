import React from 'react'
import { Button } from 'components/Button'
import { InputText } from 'components/InputText'
import { WALLET_TITLES } from 'defs/words'
import { randomInteger } from 'lib/randomInteger'
import s from './index.module.css'

export interface SetWalletTitleStepFormData {
    title: string
}

export interface SetWalletTitleStepProps {
    onSubmit: (data: SetWalletTitleStepFormData) => void
}

export function SetWalletTitleStep({
    onSubmit,
}: SetWalletTitleStepProps) {
    const [title, setTitle] = React.useState('')
    const [index, setIndex] = React.useState(randomInteger(0, WALLET_TITLES.length - 1))

    const submit = (event: React.FormEvent) => {
        event.preventDefault()

        onSubmit({
            title,
        })
    }

    return (
        <form
            className={s.Root}
            onSubmit={submit}
        >
            <InputText
                className={s.Input}
                rightIcon="wand"
                rightAction={() => {
                    setTitle(WALLET_TITLES[index])
                    setIndex(index + 1 < WALLET_TITLES.length ? index + 1 : 0)
                }}
                inputAttrs={{
                    value: title,
                    placeholder: 'Title',
                    onChange: event => setTitle(event.target.value),
                }}
            />

            <Button
                className={s.Input}
                type="submit"
                text="Save"
                wide
            />
        </form>
    )
}
