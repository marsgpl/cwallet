import React from 'react'
import { cn } from 'lib/cn'
import s from './index.module.css'

export type ButtonBg = 'primary' | 'white' | 'trans'
export type ButtonSize = 'l' | 'm' | 's'

export interface ButtonProps {
    text?: string
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    bg?: ButtonBg
    textColor?: string
    wide?: boolean
    size?: ButtonSize
}

function getBgClass(bg?: ButtonBg): string {
    switch (bg) {
        case 'white': return s.BgWhite
        case 'trans': return s.BgTrans
        default: return s.BgPrimary
    }
}

function getSizeClass(size?: ButtonSize): string {
    switch (size) {
        case 'm': return s.SizeM
        case 's': return s.SizeS
        default: return s.SizeL
    }
}

export function Button({
    text,
    type,
    onClick,
    className,
    bg,
    textColor,
    wide,
    size,
}: ButtonProps) {
    return (
        <button
            type={type || 'button'}
            onClick={onClick}
            className={cn(
                s.Root,
                wide && s.Wide,
                getBgClass(bg),
                getSizeClass(size),
                className,
            )}
            style={{
                color: textColor,
            }}
        >
            {text || ''}
        </button>
    )
}
