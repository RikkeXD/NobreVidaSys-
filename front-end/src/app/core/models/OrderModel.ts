import { Payment } from "./PaymentModel"
import { ProductSale } from "./ProductModel"

export interface Order{
    id?: number
    usuario_id?: number
    empresa_id: number
    cliente_id: number
    pagamento: Omit<Payment,'nome'>
    embalagem_id: number
    vlr_total: number
    vlr_desc: number
    envio: string
    vlr_envio: number
    status?: string
    cod_rastreio: string | null
    produtos: ProductSale[]

}

export interface PrintOrder {
    pedido_id: number,
    assinatura: boolean
}

export interface OrderList{
    id: number,
    cliente: string,
    data: Date,
    vlr_total: number,
    status: string
}