import { hash } from "../../context/security/encrypter";
import { compare } from "bcrypt";
import Usuario from "../domain/Usuario";
import UsuarioRepository from "../domain/Usuario.Repository";

export default class UsuarioUseCases{

    private usuarioRepository : UsuarioRepository;

    constructor(usuarioRepository : UsuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }

    async registro(usuario: Usuario): Promise<Usuario> {
      if (!usuario.password){
        throw new Error("Falta password");
      } 
      const cifrada = hash(usuario.password);
      usuario.password = cifrada;
      return this.usuarioRepository.registro(usuario);
    }

    async login(usuario: Usuario): Promise<Usuario> {
      if (!usuario.password){
        throw new Error("Falta password");
      } 
      const usuarioBD = await this.usuarioRepository.login(usuario);
      if (!usuarioBD){
        throw new Error("Usuario no encontrado");
      }
      const iguales = await compare(usuario.password, String(usuarioBD.password));
      
      if (iguales) {
        return usuarioBD;
      } else {
        throw new Error("Usuario/contraseña no es correcto");
      }
    }

    async editarUsuario(token : string | undefined, usuarioAutentificado : Usuario): Promise<Usuario> {
        const contraseña = usuarioAutentificado.password || '';
        const cifrada = hash(contraseña);
        usuarioAutentificado.password = cifrada;
        return await this.usuarioRepository.editarUsuario(token, usuarioAutentificado)
    }
  
}