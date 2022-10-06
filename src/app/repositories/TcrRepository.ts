import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Tcr } from "src/entities/Tcr";
import { Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class TcrRepository extends MainRepository {

    getVelocidadPropagacionAndLongitudLlama(modelo: string, pendiente: number, humedad: number, velocidad: number): Observable<{longitudLlama: number, velocidadPropagacion: number}> {
        let queryFunction = (connection, subscriber) => {
            const repository: Repository<Tcr> = connection.getRepository(Tcr);
            return repository.createQueryBuilder("tcr")
            .where("tcr.modelo = :modelo", { modelo: modelo })
            .andWhere("tcr.humedad = :humedad", { humedad: humedad })
            .andWhere("tcr.pendiente = :pendiente", { pendiente: pendiente })
            .andWhere("tcr.velocidad = :velocidad", { velocidad: velocidad })
            .getOne().then(resultado => subscriber.next(resultado));
        };
        return this.runQuery(queryFunction);
    }
}