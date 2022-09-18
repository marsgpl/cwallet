import { Loader } from 'components/Loader'
import s from './index.module.css'

export function LoadingPage() {
    return (
        <div className={s.Root}>
            <Loader />
        </div>
    )
}
