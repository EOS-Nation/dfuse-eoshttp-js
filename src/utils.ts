export function queryParams(params: {[key: string]: any}) {
    const entries = []
    for (const key of Object.keys(params)) {
        const value = params[key]
        if (value !== undefined) entries.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
    return entries.join("&")
}