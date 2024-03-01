import Usuario from "./Usuario";

export default interface UsuarioRepository {
    registro(usuario: Usuario): Promise<Usuario>;
    login(usuario: Usuario): Promise<Usuario>;
    editarUsuario(token : string | undefined, usuario: Usuario):Promise<Usuario>
}
