import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class TokenService {

    private tokenStorage = localStorage

    setToken(token: string, id: string, nome: string, sobrenome: string, permissao: string, empresaPrincipal: string) {
        this.tokenStorage.setItem('token', token)
        this.tokenStorage.setItem('id', id)
        this.tokenStorage.setItem('nome', nome)
        this.tokenStorage.setItem('sobrenome', sobrenome)
        this.tokenStorage.setItem('permissao', permissao)
        this.tokenStorage.setItem('empresaPrincipal', empresaPrincipal)
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

    getSobrenome() {
        return this.tokenStorage.getItem('sobrenome')
    }

    getPermissao() {
        return this.tokenStorage.getItem('permissao')
    }
    getEmpresaPrincipal() {
        return this.tokenStorage.getItem('empresaPrincipal')
    }

    removeToken() {
        this.tokenStorage.removeItem('token')
        this.tokenStorage.removeItem('nome')
        this.tokenStorage.removeItem('id')
        this.tokenStorage.removeItem('sobrenome')
        this.tokenStorage.removeItem('permissao')
        this.tokenStorage.removeItem('empresaPrincipal')
    }
}