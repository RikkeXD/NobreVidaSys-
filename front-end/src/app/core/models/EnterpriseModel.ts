import { Address } from "./AddressModel";

export interface Enterprise {
    id: number;
    razao_social: string;
    cnpj: string;
    email:string
    telefone: string;
    endereco: Address;
    image: string | null
}

export interface Enterprise_RazaoSocial {
    id: number,
    razao_social: string;
}

export interface EmpresasLista {
    name: string,
    code: number,
  }