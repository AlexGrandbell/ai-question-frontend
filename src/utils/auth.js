// src/utils/auth.js

const USER_KEY = 'userInfo';

export function setUserInfo(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserInfo() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : { id: 1, username: '嘉瑞' };
}

export function clearUserInfo() {
    localStorage.removeItem(USER_KEY);
}