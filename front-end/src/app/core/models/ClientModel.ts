import { Address } from "./AddressModel";
import { Enterprise_RazaoSocial } from "./EnterpriseModel";

export interface Client {
    id: number;
    id_usuario?: number;
    nome: string;
    sobrenome: string;
    telefone: string;
    cpf?: string | null;
    email?: string | null;
    empresas: Enterprise_RazaoSocial[]
    endereco: Address
}