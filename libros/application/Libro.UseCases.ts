import LibroRepository from "../domain/Libro.Repository";
import Libro from "../domain/Libro";
import PrestamoRepository from "../../prestamos/domain/Prestamo.Repository";
import Prestamo from "../../prestamos/domain/Prestamo";

export default class LibroUseCases{

    private libroRepository : LibroRepository;
    private prestamoRepository: PrestamoRepository;

    constructor(libroRepository : LibroRepository, prestamoRepository: PrestamoRepository){
        this.libroRepository = libroRepository;
        this.prestamoRepository = prestamoRepository;
    }

    async getPaginas() {
        return await this.libroRepository.getPaginas();
    }  

    async getLibrosConEjemplaresDisponibles(pagina: string): Promise<Libro[]>{
        return this.libroRepository.getLibrosConEjemplaresDisponibles(pagina);
    }

    async getPaginasByNombreLibro(busca: string){
        return await this.libroRepository.getPaginasByNombreLibro(busca);
    }

    async getLibrosConEjemplaresDisponiblesByTitulo(busca: string, pagina: string): Promise<Libro[]> {
        return this.libroRepository.getLibrosConEjemplaresDisponiblesByTitulo(busca, pagina);
    }

    async postLibro(token: string | undefined, libro: string): Promise<Prestamo> {
        return this.prestamoRepository.postPrestarLibro(token, libro);
    }

    async getLibrosPrestadosUsuario(token: string | undefined): Promise<Prestamo[]> {
        return this.prestamoRepository.getPrestamosUsuario(token);
    }
    async putLibro(token: string | undefined, ejemplar: string) {
        return this.prestamoRepository.putDevolverLibro(token,ejemplar);
    }
}