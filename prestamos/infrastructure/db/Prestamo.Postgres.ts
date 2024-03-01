import executeQuery from "../../../context/db/PostgresConnection";
import Prestamo from "../../domain/Prestamo";
import PrestamoRepository from "../../domain/Prestamo.Repository";

export default class PrestamoRepositoryPostgres implements PrestamoRepository{
    async postPrestarLibro(usuario:string, ejemplar: Number): Promise<Prestamo> {
        await executeQuery(`INSERT INTO prestamos(usuario, ejemplar, fechaprestamo, fechadevolucion) VALUES ('${usuario}', ${ejemplar}, CURRENT_TIMESTAMP, NULL);`);
        return this.getUsuarioByEmail(ejemplar);
    }
    
    async getUsuarioByEmail(ejemplar : Number){
        const prestamoDB : any[] = await executeQuery(`SELECT * FROM public.prestamos WHERE ejemplar = '${ejemplar}'`);
        let prestamo : Prestamo = {
            ejemplar: prestamoDB[0].ejemplar,
            usuario : prestamoDB[0].usuario,
            fechaprestamo: prestamoDB[0].fechaprestamo
        }
        return prestamo;
    }

}