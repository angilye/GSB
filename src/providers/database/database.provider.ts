import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {

    constructor(private sqlite: SQLite) { }

    public getDB() {
        return this.sqlite.create({
            name: 'gsb.db',
            location: 'default'
        });
    }

    

}