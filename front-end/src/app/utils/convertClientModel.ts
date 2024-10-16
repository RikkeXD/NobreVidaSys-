import { Client } from "../core/models/ClientModel";

export function ConvertEditClient(client: any): Client{
    return {
        id: client.id,
        nome: client.nome,
        sobrenome: client.sobrenome,
        telefone: client.telefone,
        cpf: client.cpf,
        email: client.email,
        empresas: client.empresas.map((empresas: any) => ({
            id: empresas.code,
            razao_social: empresas.name
        })),
        endereco:{
            cep: client.cep,
            endereco: client.endereco,
            numero: client.numero,
            bairro: client.bairro,
            uf: client.uf,
            cidade: client.cidade,
            complemento: client.complemento,
        }
    }
}

export function convertCreateClient(client: any): Omit<Client, "id">{
    return {
        nome: client.nome,
        sobrenome: client.sobrenome,
        telefone: client.telefone,
        cpf: client.cpf,
        email: client.email,
        empresas: client.empresa.map((empresas: any) => ({
            id: empresas.code,
            razao_social: empresas.name
        })),
        endereco:{
            cep: client.cep,
            endereco: client.endereco,
            numero: client.numero,
            bairro: client.bairro,
            uf: client.uf,
            cidade: client.cidade,
            complemento: client.complemento,
        }
    }
  }