export interface Address{
    cep: string,
    endereco: string;
    numero: string;
    bairro: string;
    uf: string;
    cidade: string;
    complemento?: string | null;
}