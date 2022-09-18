import { cn } from 'lib/cn'
import s from './index.module.css'

export type IconId =
    | 'close'
    | 'copy'
    | 'delete'
    | 'edit'
    | 'left'
    | 'right'
    | 'lock'
    | 'logo'
    | 'menu'
    | 'more'
    | 'plus'
    | 'search'
    | 'star'
    | 'wand'

export interface IconProps {
    id: IconId
    className?: string
}

function getIconClass(id: IconId): string {
    switch (id) {
        case 'close': return s.close
        case 'copy': return s.copy
        case 'delete': return s.delete
        case 'edit': return s.edit
        case 'left': return s.left
        case 'right': return s.right
        case 'lock': return s.lock
        case 'logo': return s.logo
        case 'menu': return s.menu
        case 'more': return s.more
        case 'plus': return s.plus
        case 'search': return s.search
        case 'star': return s.star
        case 'wand': return s.wand
    }
}

export function Icon({ id, className }: IconProps) {
    return <div className={cn(s.Root, getIconClass(id), className)} />
}
