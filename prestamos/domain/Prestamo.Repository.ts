import Prestamo from "./Prestamo";

export default interface PrestamoRepository{
    postPrestarLibro(token : string | undefined, libro: string): Promise<Prestamo>;
    getPrestamosUsuario(token: any): Promise<Prestamo[]>;
    putDevolverLibro(token: string | undefined, ejemplar: string): Promise<Prestamo>;


}