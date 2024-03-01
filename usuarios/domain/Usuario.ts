import Libro from "../../libros/domain/Libro";

export default interface Usuario{
    email: string,
    alias?: string,
    password?: string,
    nombre?: string,
    apellidos?: string,
    prestados?: Libro[];
}