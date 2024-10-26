import { EmpresasLista, EnterpriseRazaoSocial } from "./EnterpriseModel"

export interface Packing{
    id: number,
    nome: string,
    altura: number,
    comprimento: number,
    largura: number,
    peso: number
    empresas: EnterpriseRazaoSocial[]
}

export interface PackingSale{
    nome: string,
    embalagem_id: number,
    vlr_envio: number | null
    cod_rastreio?: string
}

export interface OrderFinished{
    message: string,
    pedido_id: number,
    resultEtiqueta: {
        status: string,
        message: string | null
    }
}