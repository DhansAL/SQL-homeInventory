import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, TABLENAMES } from "../../src/constants/tableNames";
import { addDefaultColumns, createNameOnlyTable, references, url } from "../../src/utils/tableUtils";



/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {

    // put country relation in state table  
    // note difference between createtable and table. table - do stuff to existing table.
    await knex.schema.table(TABLENAMES.state, (table) => {
        table.string("code")
        references(table, TABLENAMES.country)
    })

    // add country code and seperate it from country name. same for states.
    await knex.schema.table(TABLENAMES.country, (table) => {
        table.string("code")
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
    // ITEM TABLE.
    await knex.schema.createTable(TABLENAMES.item, (table) => {
        table.increments().notNullable();
        table.string("name", 1000).notNullable()
        table.text("description")
        table.string("sku", 42).notNullable() // the barcode
        table.string("sparks_joy").defaultTo(true)

        references(table, TABLENAMES.user)
        references(table, TABLENAMES.item_type)
        references(table, TABLENAMES.company)
        references(table, TABLENAMES.size)
        addDefaultColumns(table)
    })

    await knex.schema.createTable(TABLENAMES.item_info, (table) => {
        table.increments().notNullable();
        table.dateTime("purchase_date").notNullable();
        table.dateTime("expiration_date");
        table.dateTime("last_used");
        table.float("purchase_price").notNullable().defaultTo(0)
        // sale price, not actual cost
        table.float("msrp").notNullable().defaultTo(0)

        references(table, TABLENAMES.user)
        references(table, TABLENAMES.company, false, "retailer")
        references(table, TABLENAMES.item_type)
        references(table, TABLENAMES.inventory_location)

        addDefaultColumns(table)
    })

    await knex.schema.createTable(TABLENAMES.item_image, (table) => {
        table.increments().notNullable();
        url(table, "image_url")
        references(table, TABLENAMES.item)
        addDefaultColumns(table)
    })



    await knex.schema.createTable(TABLENAMES.related_item, (table) => {
        table.increments().notNullable();
        references(table, TABLENAMES.item)
        references(table, TABLENAMES.item, false, "related_item")
        addDefaultColumns(table)
    })


};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await Promise.all([
        TABLENAMES.size,
        TABLENAMES.item,
        TABLENAMES.item_info,
        TABLENAMES.item_image,
        TABLENAMES.related_item,
    ].reverse().map((name) => {
        try {
            // knex.schema.dropTable(tableName)  //this does not work on foreign keys for some reason
            return knex.raw(`DROP TABLE IF EXISTS "${name}" CASCADE`)//remember to return 
        } catch (error) {
            console.error("knex:error while rolling back migration, ", error.message)
        }
    })
    )
    // put country relation in state table 
    await knex.schema.table(TABLENAMES.state, (table) => {
        table.dropColumn("country_id")
        table.dropColumn("code")

    })

    await knex.schema.table(TABLENAMES.country, (table) => {
        table.dropColumn("code")
    })

};
