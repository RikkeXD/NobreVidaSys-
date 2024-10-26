import { EnterpriseRazaoSocial } from "./EnterpriseModel"

export interface Product {
    id: number,
    nome: string,
    fornecedor: string,
    cod_barras: string,
    peso: string
    empresas: EnterpriseRazaoSocial[]
}

export interface ProductSale{
    produto_id: number,
    qntd: number,
    vlr_uni: number,
    vlr_desc: number
    peso: number
}