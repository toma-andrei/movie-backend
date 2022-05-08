import mysql from "mysql";
import "dotenv/config";

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) console.log(`DB ERROR: ${err}`);
  else {
    console.log("Connected to the database");
  }
});

connection.query(`USE ${process.env.DATABASE};`);
export default connection;
