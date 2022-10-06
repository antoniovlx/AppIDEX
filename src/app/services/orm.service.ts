/* eslint-disable prefer-const */
import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteSet, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Connection, ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { SQLiteService } from './sqlite.service';
import { HttpClient } from '@angular/common/http';
import entities from 'src/entities';
import * as localForage from 'localforage';
import { Platform } from '@ionic/angular';


// We need these three global variables so that we can access them
// from the Proxy patched methods.
// eslint-disable-next-line no-underscore-dangle
let _sqliteConnection: SQLiteConnection = null;
// eslint-disable-next-line no-underscore-dangle
let _sqliteDBConnection: SQLiteDBConnection = null;
// eslint-disable-next-line no-underscore-dangle
let _ormService: any = null;

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'db_name';

const databaseName = "data"

@Injectable({
  providedIn: 'root',
})
export class OrmService {
  private dbConnection: Connection;

  private initialized = new BehaviorSubject<Connection>(null);

  // These two are only used in web version -- for dev purposes only
  private patchedSQLiteConnection: SQLiteConnection;
  private dbSaver = new Subject<boolean>();

  platform: string;

  constructor(private sqlite: SQLiteService, private http: HttpClient, private platformIonic: Platform) {
    _ormService = this;
    this.platform = Capacitor.getPlatform();
  }

  isDatabaseFirstLoaded(): Promise<string> {
    return localForage.getItem("databaseLoaded");
  }

  getDBConnection(): Connection {
    return this.dbConnection;
  }

  getInitializedDB$() {
    return this.initialized.asObservable();
  }

  async initialize() {
    this.initializeDB().then(async () => {
      try {
        this.dbConnection = await this.createConnection();
        console.log(this.dbConnection);
        console.log('Connection created!');
        this.initialized.next(this.dbConnection);
        //await this.createMockData();
      } catch (error) {
        console.log('Error creating db:' + error);
      }
    });
  }

  /**
   * Initialize the database. On device does nothing. On web, sets up the
   * IndexDB database, if it doesn't exist.
   */
  async initializeDB() {
    await this.sqlite.initializePlugin();
    // const p = this.sqlite.platform;
    // console.log(`plaform ${p}`);
    if (this.platform === 'web') {
      await customElements.whenDefined('jeep-sqlite');
      const jeepSqliteEl = document.querySelector('jeep-sqlite');
      if (jeepSqliteEl != null) {
        await this.sqlite.initWebStore();
        console.log(`isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
        console.log(`$$ jeepSqliteEl is defined $$`);
      } else {
        console.log('$$ jeepSqliteEl is null');
        throw Error('jeepSqliteEl is null');
      }
    }
  }

  private async createConnection(): Promise<Connection> {
    // when using Capacitor, you might want to close existing connections,
    // otherwise new connections will fail when using dev-live-reload
    // see https://github.com/capacitor-community/sqlite/issues/106
    CapacitorSQLite.checkConnectionsConsistency({
      dbNames: [databaseName], // i.e. "i expect no connections to be open"
    }).catch((e) => {
      // the plugin throws an error when closing connections. we can ignore
      // that since it is expected behaviour
      console.log(e);
      return null;
    });

    // create a SQLite Connection Wrapper
    _sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    this.patchedSQLiteConnection = _sqliteConnection;
    if (this.sqlite.platform === 'web') {
      this.patchSqliteConnection(_sqliteConnection);
    }
    // copy preloaded dbs (optional, not TypeORM related):
    // the preloaded dbs must have the `YOUR_DB_NAME.db` format (i.e. including
    // the `.db` suffix, NOT including the internal `SQLITE` suffix from the plugin)

    //await _sqliteConnection.copyFromAssets()

    //if (this.platform !== 'electron') {
    //console.log(this.platform)
    await this.sqlite.copyFromAssets(false);
    //}

    const dbOptions: ConnectionOptions = {
      logging: ['error', 'query', 'schema'],
      type: 'capacitor',
      driver: this.patchedSQLiteConnection, // pass the connection wrapper here
      database: databaseName, // database name without the `.db` suffix,
      mode: 'no-encryption',
      synchronize: false,
      logger: 'simple-console',
      entities,
      version: 1
    };
    // create the TypeORM connection
    return await createConnection(dbOptions);
  }

  /**
   * On web, patch the SQLiteConnection object so that we can detect changes
   * to the database caused by TypeORM methods. In this case we mark the DB
   * as pending save and issue a save after a timeout. The timeout is to prevent
   * too frequent saves to the IndexedDB, which is needless.
   *
   * On a device, this function does nothing.
   *
   * @param conn SQLiteConnection object returned by new SQLiteConnection()
   * @returns void
   */
  private patchSqliteConnection(conn: SQLiteConnection): void {
    if (this.sqlite.platform !== 'web') {
      return;
    }
    this.setupAutoSaver();
    this.patchedSQLiteConnection = new Proxy(conn, {
      // eslint-disable-next-line arrow-body-style
      get: (target, prop, receiver) => {
        if (prop.toString() === 'createConnection') {
          console.log(`patchedSQLiteConnection.get - createConnection`);
          return this.myCreateConnection;
        }
        return Reflect.get(target, prop, receiver);
      },
      apply: (target, that, args) => {
        console.log(`patchedSqliteConnection - target: ${target}`);
        return Reflect.apply(target as any, that, args);
      }
    });
  }

  // Patch method, called from Proxy object
  private myCreateConnection(database: string, encrypted: boolean, mode: string, version: number): Promise<SQLiteDBConnection> {
    // console.log('myCreateConnection');
    return _sqliteConnection.createConnection(database, encrypted, mode, version).then(conn => {
      _sqliteDBConnection = conn;
      const patchedConn = new Proxy(conn, {
        get: (target, prop) => {
          if (prop.toString() === 'execute') {
            return _ormService.myExecute;
          } else if (prop.toString() === 'executeSet') {
            return _ormService.myExecuteSet;
          } else if (prop.toString() === 'query') {
            return _ormService.myQuery;
          }
          return Reflect.get(target, prop);
        }
      });
      return patchedConn;
    });
  }
  // Patch method, called from Proxy object
  private myExecute(statement: string, transaction?: boolean) {
    // console.log(`mysqliteDBConnection.execute - statement: ${statement}`);
    if (statement.split(' ')[0].toUpperCase() !== 'SELECT') {
      //console.log(`mysqliteDBConnection.execute - statement: ${statement}`);
      _ormService.dbSaver.next(true);
    }
    return _sqliteDBConnection.execute(statement, transaction);
  }
  // Patch method, called from Proxy object
  private myExecuteSet(set: capSQLiteSet[], transaction?: boolean) {
    // console.log(`mysqliteDBConnection.executeSet - statement: ${JSON.stringify(set)}`);
    for (const element of set) {
      if (element.statement.split(' ')[0].toUpperCase() !== 'SELECT') {
        //console.log(`mysqliteDBConnection.executeSet - statement: ${element.statement}`);
        _ormService.dbSaver.next(true);
        break;
      }
    }
    return _sqliteDBConnection.executeSet(set, transaction);
  }
  // Patch method, called from Proxy object
  private myQuery(statement: string, values?: any[]) {
    if (statement.split(' ')[0].toUpperCase() !== 'SELECT') {
      //console.log(`mysqliteDBConnection.query - statement: ${JSON.stringify(statement)}`);
      _ormService.dbSaver.next(true);
    }
    return _sqliteDBConnection.query(statement, values);
  }
  // Does delayed saving of localForage db to IndexedDB
  private setupAutoSaver() {
    this.dbSaver.pipe(
      debounceTime(300),
      tap(() => console.log('Time to saveToStore..')),
      switchMap(_ => _sqliteConnection.saveToStore(databaseName))
    ).subscribe();
  }
}