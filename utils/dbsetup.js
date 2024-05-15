import bcrypt from "bcrypt";
import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync("Shiva@123", salt, null);
const filePath = './utils/insert.sql';
// const connectionString = process.env.ENV=="TEST" ? process.env.TEST_DB : process.env.PROD_DB; // Change this to your actual database connection string
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoaXZha29ra3VsYTFAZ21haWwuY29tIiwiaWQiOiIxMDEiLCJyb2xlIjoicm9sZSIsImlhdCI6MTcxMDQ0NDkwOCwiZXhwIjoxNzEzMDM2OTA4fQ.PSgifS49Lt6hvhDVATrkg8HyYiNyQbrPSWXtD7BqCF4";
const image='https://payx-s3.s3.ap-south-1.amazonaws.com/fc6e2b1ffb5dde2eff2293d72d683b44';
const { Pool } = pg;

async function connectdb(db) {
  const pool = new Pool({
    connectionString: db,
  });
  const client = await pool.connect();
  return {client,pool};
}

async function endpool(client,pool) {
  client.release();
  pool.end();
}

// Function to execute SQL statements
const resetdata = async (env) => {
  try {
    const { client, pool } = await connectdb(env);
    const query = fs.readFileSync(filePath, { encoding: 'utf-8' }).replace('{{password}}', password).replace('{{image}}', image).replace('{{token}}', token);
    await client.query(query);
    endpool(client,pool);
  } catch (error) {
    console.error('Error executing query:', error);
  }
};

const executeQuery = async (query) => {
  try {
    let {client,pool} = await connectdb(process.env.PROD_DB);
    await client.query(query);
    endpool(client,pool);
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

async function filluserstable(client, pool, usersdata, dataQuery,env) {
  ({ client, pool } = await connectdb(env));
  usersdata = await client.query(dataQuery);
  console.log(`Successfully filled user table`);
  endpool(client, pool);
  return usersdata;
}

// Function to execute SQL statements
const updateusertable = async () => {
  try {
    let {client,pool} = await connectdb(process.env.OCEANAUTH_DB);
    let dataQuery = `SELECT * FROM USERS`;
    let usersdata = await client.query(dataQuery);
    dataQuery = '';
    const usersqueries = usersdata.rows.map(user => {
      if(user) dataQuery+=`UPDATE USERS SET email = '${user.email}',name = '${user.name}',address = '${user.address}',profile_pic = '${user.profile_pic}',role_id = ${user.role_id} WHERE user_id = ${user.id};`;
      else dataQuery+=`INSERT INTO USERS (user_id,email,name,address,profile_pic,created_on,role_id) VALUES (${user.id},'${user.email}','${user.name}','${user.address}','${user.profile_pic}','${user.created_on}',${user.role_id});`;
    });
    endpool(client,pool);

    usersdata = await filluserstable(client, pool, usersdata, dataQuery,process.env.TEST_DB);
    usersdata = await filluserstable(client, pool, usersdata, dataQuery,process.env.PROD_DB);
    console.log('Query executed successfully.');
  } catch (error) {
    console.error('Error executing query:', error);
  }
};

const resetdb=async()=>{
  try {
    let usersdata = await resetdata(process.env.TEST_DB);
    usersdata = await resetdata(process.env.PROD_DB);
    console.log('Database data reseted successfully');
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

const getdata = async (env) => {
  try{
    let {client,pool} = await connectdb(env);
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
      if (table === 'order') {
        dataQuery = `SELECT * FROM "order";`; // Use double quotes for reserved keywords
      }
      dataQuery = `SELECT * FROM ${table};`;
      const dataResult = await client.query(dataQuery);
      jsonData[table] = dataResult.rows;
    }
    endpool(client,pool);
    return JSON.stringify(jsonData, null, 2);
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

const gettestdata = async () => {
  try {
    let data = await getdata(process.env.TEST_DB);
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

const getproddata = async () => {
  try {
    let data = await getdata(process.env.PROD_DB);
    return data;
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

const filltestdatawithprod=async()=>{
  try {
    let data = await getproddata();
    let dataQuery = '';
    for (const table in data) {
      for (const row of data[table]) {
        dataQuery += `INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${Object.values(row).join(',')});`;
      }
    }
    await executeQuery(dataQuery);
    console.log('Test data filled with prod data successfully');
  } catch (error) {
    console.error('Error executing query:', error);
  }
}

export {resetdb,updateusertable,filltestdatawithprod,gettestdata,getproddata};