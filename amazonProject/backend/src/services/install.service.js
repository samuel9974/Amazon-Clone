import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PRODUCT_SELECT = `
  SELECT p.id, p.title, p.description, p.price, p.rating, p.stock, p.image_url,
         c.slug AS category_slug,
         (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id) AS review_count
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

export async function runDatabaseInstall() {
  //check if the database is already created
  const dbName = process.env.DB_NAME || "amazon_clone";
 //
  const schemaPath = path.join(__dirname, "../db/schema.sql");

  const seedPath = path.join(__dirname, "../db/seed.sql");

  //read the seed.sql file
  let schemaSql = await fs.readFile(schemaPath, "utf8");

  //read the schema.sql file
  let seedSql = await fs.readFile(seedPath, "utf8");

  //replace the amazon_clone with the database name
  schemaSql = schemaSql.replaceAll("amazon_clone", dbName);

  //replace the amazon_clone with the database name
  seedSql = seedSql.replaceAll("amazon_clone", dbName);


  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    await connection.query(schemaSql);
    await connection.query(seedSql);
  } finally {
    await connection.end();
  }

  const verifyPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: dbName,
  });

  try {
    const [[users]] = await verifyPool.query( "SELECT COUNT(*) AS count FROM users",);
    const [[categories]] = await verifyPool.query("SELECT COUNT(*) AS count FROM categories",);
    const [[products]] = await verifyPool.query( "SELECT COUNT(*) AS count FROM products",);
    const [[reviews]] = await verifyPool.query("SELECT COUNT(*) AS count FROM reviews",);

    return {
      database: dbName,
      tablesCreated: true,
      counts: {
        users: users.count,
        categories: categories.count,
        products: products.count,
        reviews: reviews.count,
      },
    };
  } finally {
    await verifyPool.end();
  }
}

export { PRODUCT_SELECT };
