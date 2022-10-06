import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Pendientes } from "src/entities/Pendientes";
import { Repository } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class PendientesRepository extends MainRepository {

    getPendientes(): Observable<any> {
        let queryFunction = (connection, subscriber) => {
            const repository: Repository<Pendientes> = connection.getRepository(Pendientes);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }
}