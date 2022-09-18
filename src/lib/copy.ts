export function copy(value: string) {
    return navigator.clipboard.writeText(value)
}
