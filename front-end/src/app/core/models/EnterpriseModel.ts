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

export interface EnterpriseRazaoSocial {
    id: number,
    razao_social: string;
}

export interface UsuarioEmpresas {
    empresas: EnterpriseRazaoSocial[];
    empresaPrincipalId: number | null; 
  }

export interface EmpresasLista {
    name: string,
    code: number,
  }