export function getLocal<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
}

export function setLocal<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocal(key: string): void {
    localStorage.removeItem(key);
}