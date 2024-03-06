import express from "express";
import UsuarioUseCases from "../../application/Usuario.UseCases";
import UsuarioRepositoryPostgres from "../db/Usuario.Postgres";
import Usuario from "../../domain/Usuario";
import { createToken, isAuth } from "../../../context/security/auth";


const router = express.Router();
const usuarioUseCases : UsuarioUseCases = new UsuarioUseCases(new UsuarioRepositoryPostgres());

router.post("/registro", async (req, res) => {
    try {
        res.json(await usuarioUseCases.registro(req.body));
    } catch (error) {        
        res.status(500).json({error: "Internal Server Error"})
    }
});

router.post("/login", async (req, res) => {
    try {
        const usuarioLogin : Usuario = await usuarioUseCases.login(req.body);
        if (usuarioLogin == null){
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        const usuario :Usuario  = {
            email: usuarioLogin.email,
            nombre: usuarioLogin.nombre,
            apellidos: usuarioLogin.apellidos,
        };
        const token = createToken(usuario);
        res.json({token, usuario}); 
    } catch (error) {            
        res.status(500).json({error: "Internal Server Error"})
    }
});

router.put("/registro", isAuth, async (req, res) => {
    try {
        const token : string | undefined = req.body.token
        const usuario : Usuario = {
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            email: req.body.email,
            password: req.body.password
        }
        res.json(await usuarioUseCases.modify(token,usuario));
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

export default router;