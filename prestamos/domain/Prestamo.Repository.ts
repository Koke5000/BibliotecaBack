import Prestamo from "./Prestamo";

export default interface PrestamoRepository{
    postPrestarLibro(token : string | undefined, ejemplar: Number): Promise<Prestamo>;


}