export function stringifyError(error: unknown): string {
    if (error instanceof Error) {
        return String(error.message)
    }

    return String(error)
}
