import { Enterprise_RazaoSocial } from "./EnterpriseModel";

export interface Usuario {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    permissao: number;
    empresas: Enterprise_RazaoSocial[]
}