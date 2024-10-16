export interface Shipping {
    nome: string,
    vlr_envio: number | null,
    cod_rastreio: string | null
    prazo?: string
}

export interface CheckShipping {
    cliente_id: number,
    embalagem_id: number,
    peso: number
}

export interface ShippingAPI {
    prazo_pex?: string;
    valor_pex?: string;
    prazo_sedex?: string;
    valor_sedex?: string;
    prazo_pac?: string;
    valor_pac?: string;
  }