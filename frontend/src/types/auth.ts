export interface Usuario {
    id_usuario: number;
    nombre: string;
    correo: string;
    foto: string | null;
    telefono: string;
}

export interface UsuarioResponse{
    usuario: Usuario;
    local_token: string;
}

export interface UsuarioLogin{
    correo: string;
    password: string;
}