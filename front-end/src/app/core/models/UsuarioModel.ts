import { EnterpriseRazaoSocial } from "./EnterpriseModel";

export interface Usuario {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    confirmarSenha?:string;
    permissao: number;
    empresas: EnterpriseRazaoSocial[]
}

export interface Permissao {
    name: string,
    code: string
  }