export function newId(): string {
    return Date.now() + ':' + Math.random()
}
