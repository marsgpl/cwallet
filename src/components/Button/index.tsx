import React from 'react'
import { cn } from 'lib/cn'
import s from './index.module.css'

export type ButtonBg = 'primary' | 'white' | 'trans'

export interface ButtonProps {
    text?: string
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
    bg?: ButtonBg
    textColor?: string
    wide?: boolean
}

function getBgClass(bg?: ButtonBg): string {
    switch (bg) {
        case 'white': return s.BgWhite
        case 'trans': return s.BgTrans
        default: return s.BgPrimary
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
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={cn(
                s.Root,
                wide && s.Wide,
                getBgClass(bg),
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
