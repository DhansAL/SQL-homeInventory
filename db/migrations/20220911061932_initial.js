import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, TABLENAMES } from "../../src/constants/tableNames";
import { addDefaultColumns, createNameOnlyTable, references, url } from "../../src/utils/tableUtils";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function up(knex) {
    // PK ONLY TABLES
    await Promise.all([
        knex.schema.createTable(TABLENAMES.user, (table) => {
            table.increments().notNullable()
            table.string('email', MAX_EMAIL_LENGTH).notNullable().unique()
            table.string('name', 254).notNullable()
            // table.text('password').notNullable() //text gonna take more memory
            table.string('password', MAX_PASSWORD_LENGTH).notNullable()
            table.datetime('last_login')
            addDefaultColumns(table)
        }),
        knex.schema.createTable(TABLENAMES.location, (table) => {
            table.increments().notNullable()
            table.string("name").notNullable().unique()
            table.string("description", 1000);
            url(table, 'image_url')

            addDefaultColumns(table)
        }),
        createNameOnlyTable(knex, TABLENAMES.shape),
        createNameOnlyTable(knex, TABLENAMES.item_type),
        createNameOnlyTable(knex, TABLENAMES.country),
        createNameOnlyTable(knex, TABLENAMES.state),
    ]);

    // tables with FK
    await knex.schema.createTable(TABLENAMES.address, (table) => {
        table.increments().notNullable();
        // lines of address 1,2 ...
        table.string("street_address_1", 50).notNullable()
        table.string("street_address_2", 50)
        table.string("city", 50).notNullable()
        table.string("zipcode", 20).notNullable()
        table.float("latitude").notNullable()
        table.float("longitude").notNullable()
        // table.integer("state_id").unsigned().references('id').inTable("state")
        references(table, "state", false)
        references(table, "country")
        addDefaultColumns(table)
    })
    await knex.schema.createTable(TABLENAMES.manufacturer, (table) => {
        table.increments().notNullable();
        table.string("name").notNullable()
        url(table, "logo_url")
        table.string("description", 1000)
        url(table, 'website_url')
        table.string("email", MAX_EMAIL_LENGTH).notNullable().unique()
        references(table, "address")
        addDefaultColumns(table)
    })

}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await Promise.all([
        TABLENAMES.address,
        TABLENAMES.user,
        TABLENAMES.item_type,
        TABLENAMES.shape,
        TABLENAMES.country,
        TABLENAMES.state,
        TABLENAMES.manufacturer,
        TABLENAMES.location,
    ].map(tableName => {
        try {
            // knex.schema.dropTable(tableName)  //this does not work on foreign keys for some reason
            return knex.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE`)//remember to return 
        } catch (error) {
            console.error("knex:error while rolling back migration, ", error.message)
        }
    })
    )
}
