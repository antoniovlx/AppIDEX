import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Connection } from "typeorm";
import { OrmService } from "../services/orm.service";

@Injectable({
    providedIn: 'root'
})
export class MainRepository {
    isInitializedDb$: Observable<Connection>
    dBConnection: Connection;

    constructor(public ormService: OrmService){
        this.isInitializedDb$ = this.ormService.getInitializedDB$();

        this.isInitializedDb$.subscribe(connection =>{
            this.dBConnection = connection;
        })
    }

    runQuery(queryFunction): Observable<any> {
        return new Observable(subscriber => {
            this.isInitializedDb$.subscribe(connection => {
                if (connection !== null) {
                   return queryFunction(connection, subscriber);
                }
            })
        });
    }

    getDBConnection(): Connection{
        return this.dBConnection;
    }
}
