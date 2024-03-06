import executeQuery from "../../../context/db/PostgresConnection";
import Libro from "../../domain/Libro";
import LibroRepository from "../../domain/Libro.Repository";

export default class LibroRepositoryPostgres implements LibroRepository{

    async getPaginas(): Promise<Number> {
        const librosDB : any = await executeQuery("SELECT COUNT(*) AS total_libros FROM libros;");     
        return Math.ceil(librosDB[0].total_libros / 10);
    }

    async getLibrosConEjemplaresDisponibles(pagina: string): Promise<Libro[]> {
        const libros : Libro[] = [];
        const librosDB : Libro[] = await executeQuery(`SELECT libros.id, libros.titulo, libros.autor, COUNT(ejemplares.id) AS disponibles FROM libros JOIN ejemplares ON libros.id = ejemplares.libro WHERE ejemplares.disponibles = true GROUP BY libros.id, libros.titulo, libros.autor LIMIT 10 OFFSET ${pagina} * 10;`);
        for (const libroDB of librosDB) {
            const libro :Libro = {
                id: libroDB.id,
                titulo: libroDB.titulo,
                autor: libroDB.autor,
                disponibles: libroDB.disponibles
            }
            libros.push(libro);
        }

        return libros;
    }

    async getPaginasByNombreLibro(busca: string): Promise<Number> {
        const librosDB : any = await executeQuery(`SELECT COUNT(*) AS total_libros FROM libros WHERE titulo LIKE '%${busca}%';`);     
        return Math.ceil(librosDB[0].total_libros / 10);
    }

    async getLibrosConEjemplaresDisponiblesByTitulo(busca: string, pagina: string): Promise<Libro[]> {
        const libros : Libro[] = [];
        const librosDB : Libro[] = await executeQuery(`SELECT libros.id, libros.titulo, libros.autor, COUNT(ejemplares.id) AS disponibles FROM libros JOIN ejemplares ON libros.id = ejemplares.libro AND ejemplares.disponibles = true WHERE LOWER(libros.titulo) LIKE LOWER('%${busca}%') GROUP BY libros.id, libros.titulo, libros.autor LIMIT 10 OFFSET ${pagina} * 10;`);
        for (const libroDB of librosDB) {
            const libro :Libro = {
                id: libroDB.id,
                titulo: libroDB.titulo,
                autor: libroDB.autor,
                disponibles: libroDB.disponibles
            }
            libros.push(libro);
        }

        return libros;
    }
    
}

