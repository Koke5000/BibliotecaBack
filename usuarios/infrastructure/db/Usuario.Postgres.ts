import executeQuery from "../../../context/db/PostgresConnection";
import Usuario from "../../domain/Usuario";
import UsuarioRepository from "../../domain/Usuario.Repository";

export default class UsuarioRepositoryPostgres implements UsuarioRepository{

    async getUsuarioByEmail(email : string){
        const usuarioDB : any[] = await executeQuery(`SELECT * FROM usuarios WHERE email = '${email}'`);
        const usuario : Usuario = {
            email: usuarioDB[0].email
        }
        return usuario;
    }
    
    async registro(usuario: Usuario): Promise<Usuario> {
        await executeQuery(`INSERT INTO usuarios (email, password, nombre, apellidos) VALUES ('${usuario.email}', '${usuario.password}', '${usuario.nombre}', '${usuario.apellidos}')`);
        return this.getUsuarioByEmail(usuario.email);
    }

    async login(usuario: Usuario): Promise<Usuario> {
        const usuarioDB : any[] = await executeQuery(`SELECT * FROM usuarios WHERE email = '${usuario.email}'`);
        if (usuarioDB.length === 0) {
            throw new Error("Usuario/contraseña no es correcto");
        } else {
            const usuario: Usuario = {
                email: usuarioDB[0].email,
                nombre: usuarioDB[0].nombre,
                apellidos: usuarioDB[0].apellidos,
                password: usuarioDB[0].password,
            };
        return usuario;
        }
    }
    
    async modify(token: string | undefined, usuario: Usuario): Promise<Usuario> {
        await executeQuery(`UPDATE usuarios SET email = '${usuario.email}', password = '${usuario.password}', nombre = '${usuario.nombre}', apellidos = '${usuario.apellidos}' WHERE email = '${token}';`);
        return this.getUsuarioByEmail(usuario.email);
    }

}