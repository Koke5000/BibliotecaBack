import Libro from "./Libro";

export default interface LibroRepository{
    getPaginas(): Promise<Number>;
    getPaginasByNombreLibro(busca: string): Promise<Number>;
    getLibrosConEjemplaresDisponibles(pagina: string): Promise<Libro[]>;
    getLibrosConEjemplaresDisponiblesByTitulo(busca: string, pagina: string): Promise<Libro[]>;
}