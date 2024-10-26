import { EmpresasLista } from "../core/models/EnterpriseModel";
import { Usuario } from "../core/models/UsuarioModel";

export function ConvertEditUser(user: any): Omit<Usuario, 'senha'>{
    return {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        permissao: user.permissao,
        empresas: user.empresas.map((empresa: any) => ({
            id: empresa.code,
            razao_social: empresa.name
        }))
    }
}

export function ConvertUsuario (usuario: any, empresa: any): Usuario{
    return {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
        senha: usuario.senha,
        confirmarSenha: usuario.confirmarSenha,
        permissao: usuario.permissao,
        empresas: empresa.map((empresa: any) => ({
            id: empresa.code,
            razao_social: empresa.name
        }))
    }
}