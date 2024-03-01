import executeQuery from "../../../context/db/PostgresConnection"
import Libro from "../../domain/Libro";
import LibroRepository from "../../domain/Libro.Repository";

export default class LibroRepositoryPostgres implements LibroRepository{
    
    async getPaginas(): Promise<Number> {
        const librosDB : any = await executeQuery("SELECT COUNT(*) AS total_libros FROM libros;");     
        return Math.ceil(librosDB[0].total_libros / 10);
    }
    async getLibrosPagina(pagina: string): Promise<Libro[]> {
        const libros : Libro[] = [];
        const librosDB : any = await executeQuery(`SELECT * FROM libros ORDER BY id LIMIT 10 OFFSET ${pagina} * 10`);
        for (const libroDB of librosDB) {
            let libro : Libro = {
                id: libroDB.id,
                titulo: libroDB.titulo,
                autor: libroDB.autor
            }
            libros.push(libro);
        }        
        return libros;
    }    
    
    async getDisponibles(id: string): Promise<string> {
        const librosDisponiblesDB : any = await executeQuery(`SELECT COUNT(*) AS disponibles FROM ejemplares WHERE libro = '${id}' AND disponibles = 'true';`);
        return librosDisponiblesDB[0].disponibles;
    }

    async getPaginasByNombreLibro(busca: string): Promise<Number> {
        const librosDB : any = await executeQuery(`SELECT COUNT(*) AS total_libros FROM libros WHERE titulo LIKE '%${busca}%';`);     
        return Math.ceil(librosDB[0].total_libros / 10);
    }

    async getLibrosByNombreFromPagina(busca: string, pagina: string): Promise<Libro[]> {
        const libros : Libro[] = [];
        const librosDB : any = await executeQuery(`SELECT * FROM libros WHERE titulo LIKE '%${busca}%' ORDER BY id LIMIT 10 OFFSET ${pagina} * 10;`);
        for (const libroDB of librosDB) {
            let libro : Libro = {
                id: libroDB.id,
                titulo: libroDB.titulo,
                autor: libroDB.autor
            }
            libros.push(libro);
        }        
        return libros;
    }

    async getEjemplarRandom(libro: string): Promise<Number> {
        const ejemplarDB : any = await executeQuery(`SELECT * FROM ejemplares WHERE libro = ${libro} AND disponibles = 'true' ORDER BY RANDOM() LIMIT 1;`);
        return ejemplarDB[0].id;
    }

    async putDisponibleFalse(ejemplar: Number): Promise<Boolean> {
        throw new Error("Method not implemented.");
    }
}

