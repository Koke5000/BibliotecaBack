import executeQuery from "../../../context/db/PostgresConnection";
import Ejemplar from "../../../ejemplares/domain/Ejemplar";
import Libro from "../../../libros/domain/Libro";
import Prestamo from "../../domain/Prestamo";
import PrestamoRepository from "../../domain/Prestamo.Repository";

export default class PrestamoRepositoryPostgres implements PrestamoRepository{

    async getEjemplarRandom(libro: string): Promise<Number> {
        const ejemplarDB : any = await executeQuery(`SELECT * FROM ejemplares WHERE libro = ${libro} AND disponibles = 'true' ORDER BY RANDOM() LIMIT 1;`);
        await executeQuery(`UPDATE ejemplares SET disponibles = false WHERE id = ${ejemplarDB[0].id};`);
        return ejemplarDB[0].id;  
    }

    async postPrestarLibro(token: string | undefined, libro: string): Promise<Prestamo> {
        const ejemplarId : Number = await this.getEjemplarRandom(libro);
        await executeQuery(`INSERT INTO prestamos(usuario, ejemplar, fechaprestamo, fechadevolucion) VALUES ('${token}', ${ejemplarId}, CURRENT_TIMESTAMP, NULL);`);
        return this.getPrestamoByIdEjemplar(token, ejemplarId);
    }
    
    async getPrestamoByIdEjemplar(token: string| undefined, ejemplar : Number){
        const prestamoDB : any[] = await executeQuery(`SELECT * FROM prestamos WHERE ejemplar = '${ejemplar}' AND usuario = '${token}'`);
        let prestamo : Prestamo = {
            ejemplar: prestamoDB[0].ejemplar,
            usuario : prestamoDB[0].usuario,
            fechaprestamo: prestamoDB[0].fechaprestamo
        }
        return prestamo;
    }

    async getPrestamoByIdEjemplarCompleto(token: string| undefined, ejemplar : Number){
        const prestamoDB : any[] = await executeQuery(`SELECT * FROM prestamos WHERE ejemplar = '${ejemplar}' AND usuario = '${token}'`);
        let prestamo : Prestamo = {
            ejemplar: prestamoDB[0].ejemplar,
            usuario : prestamoDB[0].usuario,
            fechaprestamo: prestamoDB[0].fechaprestamo,
            fechadevolucion: prestamoDB[0].fechadevolucion
        }
        return prestamo;
    }

    async getPrestamosUsuario(token: any): Promise<Prestamo[]> {
        const prestamosDB : any[] = await executeQuery(`SELECT l.id, l.titulo, l.autor, e.id AS idejemplar, p.fechaprestamo
        from libros l
        JOIN ejemplares e on l.id = e.libro
        Join prestamos p on e.id = p.ejemplar
        WHERE p.usuario = '${token}' AND p.fechadevolucion IS NULL`);
        const prestamos: Prestamo[] = prestamosDB.map(item=>{
            const libro: Libro ={
                id: item.id,
                titulo: item.titulo,
                autor: item.autor
            }
            const ejemplar: Ejemplar = {
                id: item.idejemplar,
                libro: libro
            }
            const prestado: Prestamo = {
                ejemplar: ejemplar,
                fechaprestamo: item.fechaprestamo
            }
            return prestado
        });
        return prestamos;
    }
    async putDevolverLibro(token: string | undefined, ejemplar: string): Promise<Prestamo> {
        await executeQuery(`UPDATE prestamos SET fechadevolucion = CURRENT_TIMESTAMP WHERE usuario = '${token}' AND ejemplar = ${ejemplar};;`);
        await executeQuery(`UPDATE ejemplares SET disponibles = true WHERE id = ${ejemplar};`);
        return this.getPrestamoByIdEjemplarCompleto(token, Number(ejemplar));
    }

}