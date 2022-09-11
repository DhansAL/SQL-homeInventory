import { TABLENAMES } from "../../src/constants/tableNames";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function up(knex) {
    await knex.schema.createTable(TABLENAMES.user, (table) => {
        table.increments().notNullable()
        table.string('email', 254).notNullable().unique()
        table.string('name', 254).notNullable()
        // table.text('password').notNullable() //text gonna take more memory
        table.string('password', 127).notNullable()
        table.datetime('last_login')
    })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable(TABLENAMES.user)
}
