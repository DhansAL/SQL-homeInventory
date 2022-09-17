import { MAX_URL_LENGTH } from "../../src/constants/tableNames";

/**
 * @param { import("knex").Knex.TableBuilder } table
 * @returns { Promise<void> } 
 */
export function addDefaultColumns(table) {
    table.timestamps(false, true);
    table.datetime("deleted_at");
}
/**
 * Creates a basic name only table with no other columns
 * @param { import("knex").Knex } Knex
 * @param { string } tableName name of the table
 * @returns { Promise<void> } 
 */
export function createNameOnlyTable(Knex, tableName) {
    try {
        // console.log(tableName);
        return Knex.schema.createTable(tableName, (table) => {
            table.increments().notNullable();
            table.string("name").notNullable().unique()
            addDefaultColumns(table)
        });
    } catch (error) {
        console.log("error creating name only tables,", error.message);
    }
}

/**
 * Creates a reference to foreign tables
 * @param { import("knex").Knex.TableBuilder } table
 * @param { string } tableName name of the table to which relation is made
 * @param { boolean } notNullable if false, it creates a nullable foreign key   
 * @param { string } columnName creates a custom column name instead of "table_id", if not provided, defaults to table_id   
 * @returns { Promise<void> } 
 */
export function references(table, tableName, notNullable = true, columnName = undefined) {
    const definition = table.integer(`
        ${columnName ? columnName : tableName}_id
            `).unsigned()
        .references("id")
        .inTable(tableName)
        .onDelete("cascade")

    if (notNullable) {
        definition.notNullable()
    }
}

/**
 * inserts url in a given table
 * @param { import("knex").Knex.TableBuilder } table
 * @param { string } column  desired name of column for url in the table given
 * @param { string } foreignTable name of the foreign table
 * @returns { Promise<void> } 
 */
export function url(table, column) {
    table.string(column, MAX_URL_LENGTH)
}



