import { Button } from 'components/Button'
import { ROUTE_CREATE_WALLET, ROUTE_IMPORT_WALLET } from 'defs/routes'
import { useNavigate } from 'react-router-dom'
import s from './index.module.css'

export interface WalletsProps {
}

export function Wallets({}: WalletsProps) {
    const navigate = useNavigate()

    return (
        <div className={s.Root}>
            <div className={s.Title}>
                Wallets
            </div>

            <Button
                text="Create"
                onClick={() => {
                    navigate(ROUTE_CREATE_WALLET)
                }}
            />

            <Button
                text="Import"
                onClick={() => {
                    navigate(ROUTE_IMPORT_WALLET)
                }}
            />
        </div>
    )
}
