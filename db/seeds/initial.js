import orderedTableNames from "../../src/constants/orderedTableNames";
import { TABLENAMES } from "../../src/constants/tableNames";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // this will throw error as promise.all runs all the requests in parallel, not one after another.
  // await Promise.all(orderedTableNames.map((tableName) => knex(tableName).del()))

  // to make sure that we run our promises only if other dependent table is removed as
  // mentioned in our ordered array we use reduce
  await orderedTableNames
    .reduce(async (promise, tableName) => {
      await promise;
      console.log('Knex seed in process. cleared,', tableName);
      return knex(tableName).del()
    }, Promise.resolve())

  const user = {
    email: "db@dmai.co",
    name: "db",
    password: "hardcoredb"
  }
  const [inserted] = await knex(TABLENAMES.user).insert(user).returning("*")
  console.log(inserted);

  await knex(TABLENAMES.country).insert([{
    name: "US",
  },
  {
    name: "IND"
  },
  {
    name: "JP"
  }
  ])
}
