import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, TABLENAMES } from "../../src/constants/tableNames";
import { addDefaultColumns, createNameOnlyTable, references, url } from "../../src/utils/tableUtils";



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // drop countryid from address
    await knex.schema.table(TABLENAMES.address, (table) => {
        table.dropColumn("country_id")
    })
    // put country relation in state table  
    await knex.schema.table(TABLENAMES.state, (table) => {
        references(table, TABLENAMES.country)
    })
    await knex.schema.createTable(TABLENAMES.size, (table) => {
        table.increments().notNullable();
        table.string("name").notNullable()
        table.float("length")
        table.float("width")
        table.float("height")
        table.float("volume")
        references(table, TABLENAMES.shape)
        addDefaultColumns(table)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
