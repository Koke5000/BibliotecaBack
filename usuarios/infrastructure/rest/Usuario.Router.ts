import express from "express";
import Usuario from "../../domain/Usuario";
import UsuarioRepositoryPostgres from "../db/Usuario.Postges";
import UsuarioUseCases from "../../application/Usuario.UseCases";
import { createToken, isAuth } from "../../../context/security/auth";

const router = express.Router();
const usuarioUseCases:UsuarioUseCases = new UsuarioUseCases(new UsuarioRepositoryPostgres());

router.post("/registro", async (req, res) => {
    try {
        const usuario : Usuario = await usuarioUseCases.registro(req.body)
        res.json(usuario);
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
        console.log(error);
        
        res.status(500).json({error: "Internal Server Error"})
    }
});

router.put("/registro", isAuth, async (req, res) => {
    try {
        const token : string | undefined = req.body.token
        const usuarioEditar : Usuario = {
            email: req.body.email,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            password : req.body.password
        }
        const usuario : Usuario = await usuarioUseCases.editarUsuario(token, usuarioEditar)
        res.json(usuario);
    } catch (error) {        
        console.log(error);
        
        res.status(500).json({error: "Internal Server Error"})
    }
});


export default router;