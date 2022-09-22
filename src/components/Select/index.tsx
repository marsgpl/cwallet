import { Icon } from 'components/Icon'
import { cn } from 'lib/cn'
import React from 'react'
import s from './index.module.css'

export const EMPTY_OPTION: SelectOption = {
    title: 'Select an option',
    value: '',
    disabled: true,
    hidden: true,
}

export interface SelectOption {
    title?: string
    value: string
    disabled?: boolean
    hidden?: boolean
}

export type SelectOptions = SelectOption[]

export interface SelectProps<T> {
    options: SelectOptions
    onChange: (value: T) => void
    className?: string
    selectAttrs?: React.InputHTMLAttributes<HTMLSelectElement>
}

function getDefaultValue(
    selectAttrs: React.InputHTMLAttributes<HTMLSelectElement> | undefined,
    options: SelectOptions
): string | undefined {
    return ''
}

export function Select<T extends string>({
    options,
    onChange,
    className,
    selectAttrs,
}: SelectProps<T>) {
    const selectRef = React.useRef<HTMLSelectElement>()
    const first = options[0]
    const placeholder = first?.disabled ? first.title : undefined

    return (
        <label className={cn(
            s.Label,
            s.WithRightIcon,
            className,
        )}>
            <div className={cn(s.Icon, s.IconRight)}>
                <Icon id="down" />
            </div>

            <select
                {...selectAttrs}
                ref={() => selectRef}
                onChange={event => onChange(event.target.value as T)}
                className={cn(s.Select, selectAttrs?.className)}
                defaultValue={getDefaultValue(selectAttrs, options)}
            >
                {options.map(({
                    title,
                    value,
                    disabled,
                    hidden,
                }) => (
                    <option
                        key={value}
                        value={value}
                        disabled={disabled}
                        hidden={hidden}
                    >{title || value}</option>
                ))}
            </select>

            {(placeholder !== undefined) && (
                <div className={s.Placeholder}>{placeholder}</div>
            )}
        </label>
    )
}
