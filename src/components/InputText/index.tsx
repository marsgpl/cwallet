import React from 'react'
import { Icon, IconId } from 'components/Icon'
import { Route } from 'defs/routes'
import { cn } from 'lib/cn'
import { useNavigate } from 'react-router-dom'
import s from './index.module.css'

export interface InputTextProps {
    className?: string
    leftIcon?: IconId
    rightIcon?: IconId
    rightIcon2?: IconId
    leftAction?: React.MouseEventHandler | Route
    rightAction?: React.MouseEventHandler | Route
    rightAction2?: React.MouseEventHandler | Route
    inputAttrs?: React.InputHTMLAttributes<HTMLInputElement>
    inputRef?: React.RefObject<HTMLInputElement>
}

type Action = InputTextProps['leftAction'] | InputTextProps['rightAction']

export function InputText({
    className,
    leftIcon,
    rightIcon,
    rightIcon2,
    leftAction,
    rightAction,
    rightAction2,
    inputAttrs,
    inputRef,
}: InputTextProps) {
    const [value, setValue] = React.useState('')

    const navigate = useNavigate()

    const placeholder = inputAttrs?.placeholder

    React.useEffect(() => {
        if (inputAttrs?.value !== undefined) {
            setValue(String(inputAttrs.value))
        }
    }, [inputAttrs?.value])

    const getAction = React.useCallback((action: Action) => {
        if (typeof action === 'string') {
            return () => navigate(action)
        }

        if (typeof action === 'function') {
            return action
        }
    }, [navigate])

    return (
        <label className={cn(
            s.Label,
            leftIcon && s.WithLeftIcon,
            rightIcon && s.WithRightIcon,
            rightIcon2 && s.WithRightIcon2,
            className,
        )}>
            {leftIcon ? (
                <div className={cn(s.Icon, s.IconLeft)} onClick={getAction(leftAction)}>
                    <Icon id={leftIcon} />
                </div>
            ) : null}

            {(value.length && placeholder) ? (
                <div className={s.Placeholder}>{placeholder}</div>
            ) : null}

            <input
                {...inputAttrs}
                value={value}
                ref={inputRef}
                onChange={event => {
                    inputAttrs?.onChange?.(event)
                    setValue(event.target.value)
                }}
                className={cn(s.Input, inputAttrs?.className)}
            />

            {rightIcon2 ? (
                <div className={cn(s.Icon, s.IconRight2)} onClick={getAction(rightAction2)}>
                    <Icon id={rightIcon2} />
                </div>
            ) : null}

            {rightIcon ? (
                <div className={cn(s.Icon, s.IconRight)} onClick={getAction(rightAction)}>
                    <Icon id={rightIcon} />
                </div>
            ) : null}
        </label>
    )
}
