import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'


async function viewAllProducts() {
    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    try {
        const products = await db.all('SELECT * FROM products')
        console.log(products)
    } catch(err) {
        console.log("Error fetching products: ", err)
    } finally {
        await db.close()
    }
}

viewAllProducts()