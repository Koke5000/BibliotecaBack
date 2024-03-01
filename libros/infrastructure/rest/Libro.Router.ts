import express from "express";



import { createToken, isAuth } from "../../../context/security/auth";
import LibroUseCases from "../../application/Libro.UseCases";
import LibroRepositoryPostgres from "../db/Libro.Postges";
import LibroRepository from "../../domain/Libro.Repository";
import PrestamoRepository from "../../../prestamos/domain/Prestamo.Repository";
import PrestamoRepositoryPostgres from "../../../prestamos/infrastructure/db/Prestamo.Postgres";

const router = express.Router();
const libroRepository : LibroRepository = new LibroRepositoryPostgres();
const prestamoRepository : PrestamoRepository = new PrestamoRepositoryPostgres();
const libroUseCases : LibroUseCases = new LibroUseCases(libroRepository, prestamoRepository);

router.get("/paginas", async (req, res) =>{
    try {
        res.json({numPaginas : await libroUseCases.getPaginas()});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/:pagina", async (req, res) =>{
    try {
        res.json(await libroUseCases.getLibrosPagina(req.params.pagina));
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/:busca/paginas", async (req, res) =>{
    try {
        res.json({numPaginas : await libroUseCases.getPaginasByNombreLibro(req.params.busca)});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.get("/:busca/:pagina", async (req, res) =>{
    try {
        res.json(await libroUseCases.getLibrosByNombreFromPagina(req.params.busca, req.params.pagina));
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/:libro", isAuth, async (req, res) =>{
    try {
        res.json(await libroUseCases.postPrestarLibro(req.body.token ,req.params.libro));
    } catch (error) {
        console.log(error);
        
        res.status(500).json({error: "Internal Server Error"})
    }
})




export default router;