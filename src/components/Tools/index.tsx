import { Icon } from 'components/Icon'
import { useActionMenu } from 'hooks/useActionMenu'
import s from './index.module.css'

export type ToolsMode = 'topleft'

export interface ToolsProps {
    mode: ToolsMode
}

function getModeClass(mode: ToolsMode): string {
    switch (mode) {
        case 'topleft': return s.ModeTopLeft
    }
}

export function Tools({
    mode,
}: ToolsProps) {
    const setActionMenu = useActionMenu()

    const show = () => {
        setActionMenu({
            buttons: [
                {
                    text: 'TODO',
                    onClick: () => {},
                }
            ],
        })
    }

    return (
        <div className={getModeClass(mode)} onClick={show}>
            <Icon id="more" />
        </div>
    )
}
