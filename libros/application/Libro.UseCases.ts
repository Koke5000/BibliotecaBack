import { hash } from "../../context/security/encrypter";
import { compare } from "bcrypt";
import LibroRepository from "../domain/Libro.Repository";
import PrestamoRepository from "../../prestamos/domain/Prestamo.Repository";

export default class LibroUseCases{

    private libroRepository : LibroRepository;
    private prestamoRepository : PrestamoRepository;

    constructor(libroRepository : LibroRepository, prestamoRepository : PrestamoRepository){
        this.libroRepository = libroRepository;
        this.prestamoRepository = prestamoRepository;
    }

    async getPaginas() {
        return await this.libroRepository.getPaginas();
    }    
    
    async getLibrosPagina(pagina: string) {
        const libros = await this.libroRepository.getLibrosPagina(pagina);
        for (const libro of libros) {
          libro.disponibles = await this.libroRepository.getDisponibles(libro.id);
        }
        return libros;
    }

    async getPaginasByNombreLibro(busca: string){
        return await this.libroRepository.getPaginasByNombreLibro(busca);
    }

    async getLibrosByNombreFromPagina(busca: string, pagina: string) {
        const libros = await this.libroRepository.getLibrosByNombreFromPagina(busca, pagina);
        for (const libro of libros) {
          libro.disponibles = await this.libroRepository.getDisponibles(libro.id);
        }
        return libros;
    }

    async postPrestarLibro(token : string | undefined, libro: string){
        const ejemplar = await this.libroRepository.getEjemplarRandom(libro);
        const isDisponible =  await this.libroRepository.putDisponibleFalse(ejemplar);
        if(isDisponible){
            return this.prestamoRepository.postPrestarLibro(token,ejemplar);
        }else{
            throw new Error("No quedan libros disponibles");
        }
    }

}