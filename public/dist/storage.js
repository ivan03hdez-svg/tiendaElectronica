export function getLocal(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
export function setLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function removeLocal(key) {
    localStorage.removeItem(key);
}
