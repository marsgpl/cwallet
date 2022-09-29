import { CHARSET_UTF8 } from 'defs/charset'
import { MIME_JSON } from 'defs/mimes'
import { pick } from 'lib/pick'

export function exportAsJson(fileName: string, keys: string[]) {
    const data = JSON.stringify(pick({...localStorage}, ...keys))
    const url = `data:${MIME_JSON};charset=${CHARSET_UTF8},${encodeURIComponent(data)}`

    const a = document.createElement('a')

    a.href = url
    a.download = fileName

    a.click()
}

export function importFromJsonFile(keys: string[]): Promise<true> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')

        input.type = 'file'

        input.addEventListener('change', () => {
            const file = input.files?.[0]

            if (!file) {
                return reject('File was not selected')
            }

            const reader = new FileReader()

            reader.onerror = (event) => {
                console.error('🔺', event)
                reject('Failed to read file')
            }

            reader.onload = () => {
                try {
                    importFromJsonText(String(reader.result), keys)
                    resolve(true)
                } catch (error) {
                    reject(error)
                }
            }

            reader.readAsText(file, CHARSET_UTF8)
        })

        input.click()
    })
}

export function importFromJsonText(text: string, keys: string[]) {
    const kv = JSON.parse(text)

    if (typeof kv !== 'object') {
        throw Error('Invalid format')
    }

    Object.entries(kv).forEach(([k, v]) => {
        if (!keys.includes(k)) {
            throw Error(`Unsupported key: ${k}`)
        }

        localStorage.setItem(k, String(v))
    })
}
