
class Auth {
    constructor() {
        this._key = "_accesstk";
    }

    get accessToken() {
        return localStorage.getItem(this._key);
    }

    set accessToken(newValue) {
        localStorage.setItem(this._key, newValue);
    }

    get isAuthenticated() {
        return !!(localStorage.getItem(this._key))
    }
}

export {
    Auth
};