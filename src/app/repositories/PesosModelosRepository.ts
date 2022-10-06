import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PesosModelos } from "src/entities/PesosModelos";
import { Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class PesosModelosRepository extends MainRepository {

    getPesoByModelo(modelo: string): Observable<any> {
        let queryFunction = (connection, subscriber) => {
            const repository: Repository<PesosModelos> = connection.getRepository(PesosModelos);
            return repository.createQueryBuilder("pesosModelos")
            .where("pesosModelos.modelo = :modelo", { modelo: modelo })
            .getOne().then(resultado => subscriber.next(resultado));
        };
        return this.runQuery(queryFunction);
    }
}