import Libro from "./Libro";

export default interface LibroRepository {
    getPaginas(): Promise<Number>;
    getLibrosPagina(pagina: string): Promise<Libro[]>;
    getDisponibles(id: string): Promise<string>;
    getPaginasByNombreLibro(busca: string): Promise<Number>;
    getLibrosByNombreFromPagina(busca: string, pagina: string): Promise<Libro[]>;
    getEjemplarRandom(libro: string): Promise<Number>;
    putDisponibleFalse(ejemplar: Number): Promise<Boolean>;
}
