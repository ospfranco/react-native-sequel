// IMPORTAAAAANTTTTT JSI BINDINGS DO NOT WORK WHEN CONNECTED TO THE DEBUGGER

// export { createConnection } from 'typeorm/browser'

// LOW LEVEL API, talk directly to JSI bindings
interface ISQLite {
  open: (dbName: string) => any;
  close: (dbName: string) => any;
  executeSql: (
    dbName: string,
    query: string,
    params: any[] | undefined
  ) => {
    rows: any[];
    insertId?: number;
  };
  backgroundExecuteSql: (dbName: string, query: string, params: any[]) => any;
}

// Make it globally available
declare var sqlite: ISQLite;

// API FOR TYPEORM
interface IConnectionOptions {
  name: string;
  location?: string; // not used, we are storing everything on the documents folder
}

interface IDBConnection {
  executeSql: (
    sql: string,
    args: any[],
    ok: (res: any) => void,
    fail: (msg: string) => void
  ) => void;
  close: (ok: (res: any) => void, fail: (msg: string) => void) => void;
}

export const openDatabase = (
  options: IConnectionOptions,
  ok: (db: IDBConnection) => void,
  fail: (msg: string) => void
) => {
  try {
    sqlite.open(options.name);

    const connection: IDBConnection = {
      executeSql: (
        sql: string,
        params: any[] | undefined,
        ok: any,
        fail: any
      ) => {
        try {
          let response = sqlite.executeSql(options.name, sql, params);
          console.warn(`sqlite response`, response);
          ok(response);
        } catch (e) {
          fail(e);
        }
      },
      close: (ok: any, fail: any) => {
        try {
          sqlite.close(options.name);
          ok();
        } catch (e) {
          fail(e);
        }
      },
    };

    ok(connection);
  } catch (e) {
    fail(e);
  }
};
