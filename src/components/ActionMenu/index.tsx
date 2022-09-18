import { ActionMenu as ActionMenuModel } from 'model/ActionMenu'
import { useActionMenu } from 'hooks/useActionMenu'
import { Button } from 'components/Button'
import { cn } from 'lib/cn'
import s from './index.module.css'

export interface ActionMenuProps {
    data: ActionMenuModel
}

export function ActionMenu({ data }: ActionMenuProps) {
    const setActionMenu = useActionMenu()

    const close = () => setActionMenu(undefined)

    return (
        <div className={s.Root} onClick={close}>
            <div className={s.Content}>
                {data.buttons.map((button, index) => (
                    <Button
                        key={index}
                        bg="white"
                        wide
                        {...button}
                        className={cn(s.Button, button.className)}
                    />
                ))}
            </div>
        </div>
    )
}
