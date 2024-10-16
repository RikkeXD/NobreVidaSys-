import { Enterprise } from "../core/models/EnterpriseModel"


export function convertEmpresa(empresa: any, image: string | null): Enterprise {
    return {
      id: empresa.id,
      razao_social: empresa.razao_social,
      cnpj: empresa.cnpj,
      email: empresa.email,
      telefone: empresa.telefone,
      endereco: {
        cep: empresa.cep,
        endereco: empresa.endereco,
        numero: empresa.numero,
        bairro: empresa.bairro,
        uf: empresa.uf,
        cidade: empresa.cidade,
        complemento: empresa.complemento
      },
      image: image ? image: empresa.image
    }
  }