const itemName = 'token';

export const setAuthToken = token => localStorage.setItem(itemName, token);
export const getAuthToken = () => localStorage.getItem(itemName);
export const resetAuthToken = () => localStorage.removeItem(itemName);
