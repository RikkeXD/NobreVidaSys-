import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class TokenService {

    private tokenStorage = localStorage

    setToken(token: string, id: string, nome: string) {
        this.tokenStorage.setItem('token', token)
        this.tokenStorage.setItem('id', id)
        this.tokenStorage.setItem('nome', nome)
    }

    getToken() {
        return this.tokenStorage.getItem('token')
    }
    getNome() {
        return this.tokenStorage.getItem('nome')
    }
    getId() {
        return this.tokenStorage.getItem('id')
    }

    removeToken() {
        this.tokenStorage.removeItem('token')
        this.tokenStorage.removeItem('nome')
        this.tokenStorage.removeItem('id')
    }
}