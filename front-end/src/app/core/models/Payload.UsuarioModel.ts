import { Usuario } from "./UsuarioModel";

export type payloadUsuario = Omit<Usuario, 'id'>