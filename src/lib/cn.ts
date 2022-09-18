export function cn(...names: (string | undefined | boolean)[]): string {
    return names.filter(Boolean).join(' ')
}
