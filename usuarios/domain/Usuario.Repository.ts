import Usuario from "./Usuario";

export default interface UsuarioRepository {
    login(usuario: Usuario): Promise<Usuario>;
    registro(usuario: Usuario): Promise<Usuario>;
    modify(token: string | undefined, usuario: Usuario): Promise<Usuario>;

}