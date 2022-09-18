import { Button } from 'components/Button'
import { DEFAULT_ERROR_MESSAGE } from 'defs/messages'
import { ROUTE_INDEX } from 'defs/routes'
import { useNavigate } from 'react-router-dom'
import s from './index.module.css'

export interface ErrorPageProps {
    message?: string
    resetError?: () => void
}

function refresh() {
    window.location.reload()
}

export function ErrorPage({
    message,
    resetError,
}: ErrorPageProps) {
    const navigate = useNavigate()

    return (
        <div className={s.Root}>
            <div className={s.Message}>
                {message || DEFAULT_ERROR_MESSAGE}
            </div>

            <div className={s.Buttons}>
                <Button
                    className={s.Button}
                    text="Refresh"
                    bg="white"
                    onClick={refresh}
                />

                <Button
                    className={s.Button}
                    text="Go to root"
                    bg="white"
                    onClick={() => {
                        resetError?.()
                        navigate(ROUTE_INDEX)
                    }}
                />
            </div>
        </div>
    )
}
