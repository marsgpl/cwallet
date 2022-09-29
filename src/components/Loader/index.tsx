import { cn } from 'lib/cn'
import s from './index.module.css'

export interface LoaderProps {
    mini?: boolean
}

export function Loader({ mini }: LoaderProps) {
    return <div className={cn(s.Root, mini && s.Mini)} />
}
