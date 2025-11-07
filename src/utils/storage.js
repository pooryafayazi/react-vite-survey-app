// src/utils/storage.js
export function loadState(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
export function saveState(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
}
export function clearState(key) {
    try { localStorage.removeItem(key); } catch { }
}