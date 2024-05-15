import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.DB; // Change this to your actual database connection string

// Create a PostgreSQL pool
const { Pool } = pg;
const pool = new Pool({
  connectionString: connectionString,
});

// Function to execute SQL statements
const executeQuery = async (query) => {
  const client = await pool.connect();
  try {
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'; -- Change 'public' to your schema name if needed
    `;
    const tablesResult = await client.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.table_name);

    // Fetch data from each table
    const jsonData = {};
    let dataQuery;
    for (const table of tables) {
      dataQuery = `SELECT * FROM ${table};`;
      if (table === 'order') {
        dataQuery = `SELECT * FROM "order";`; // Use double quotes for reserved keywords
      }
      const dataResult = await client.query(dataQuery);
      jsonData[table] = dataResult.rows;
    }

    // Write data to a JSON file
    const jsonFilePath = 'utils/database_data.json'; // Change the file path as needed
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
    console.log(`JSON data written to ${jsonFilePath}`);

  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    client.release();
  }
};

executeQuery();
pool.end();