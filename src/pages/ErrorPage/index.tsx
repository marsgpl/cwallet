import { Button } from 'components/Button'
import { DEFAULT_ERROR_MESSAGE } from 'defs/messages'
import { ROUTE_INDEX } from 'defs/routes'
import s from './index.module.css'

export interface ErrorPageProps {
    message?: string
    resetError?: () => void
}

function refresh() {
    window.location.reload()
}

function goTo(to: string) {
    window.location.hash = '#' + to
}

export function ErrorPage({
    message,
    resetError,
}: ErrorPageProps) {
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
                    text="Home"
                    bg="white"
                    onClick={() => {
                        resetError?.()
                        goTo(ROUTE_INDEX)
                    }}
                />
            </div>
        </div>
    )
}
