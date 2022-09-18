import { DEFAULT_ERROR_MESSAGE } from 'defs/messages'
import { copy } from 'lib/copy'
import { useToast } from './useToast'

export function useCopyValue() {
    const setToast = useToast()

    return function(
        value: string,
        message: string = 'Copied',
    ): void {
        copy(value).then(() => {
            setToast({ message })
        }).catch(error => {
            console.error('🔺', error)

            setToast({
                message: DEFAULT_ERROR_MESSAGE,
            })
        })
    }
}
