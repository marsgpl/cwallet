import { cn } from 'lib/cn'
import s from './index.module.css'

export interface LoaderProps {
    mini?: boolean
    className?: string
}

export function Loader({ mini, className }: LoaderProps) {
    return <div className={cn(s.Root, mini && s.Mini, className)} />
}
