import React from 'react'

export function useFocus(): [
    ref: React.RefObject<HTMLInputElement>,
    focus: () => void,
] {
    const ref = React.useRef<HTMLInputElement>(null)
    const focus = () => ref.current?.focus()

    return [ref, focus]
}
