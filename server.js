const express = require('express');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Definir la ruta del archivo Excel
const DB_FILE = path.join(__dirname, 'database.xlsx');

// Función para leer datos de Excel
function readExcel(sheet) {
    try {
        const workbook = XLSX.readFile(DB_FILE);
        const worksheet = workbook.Sheets[sheet];
        return XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
        console.error(`Error al leer el archivo Excel (${sheet}):`, error);
        throw error;
    }
}

// Función para escribir datos en Excel
function writeExcel(sheet, data) {
    try {
        const workbook = XLSX.readFile(DB_FILE);
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet, true);
        XLSX.writeFile(workbook, DB_FILE);
    } catch (error) {
        console.error(`Error al escribir en el archivo Excel (${sheet}):`, error);
        throw error;
    }
}

// Rutas de la API
app.get('/api/products', (req, res) => {
    try {
        const products = readExcel('Sheet1');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/products', (req, res) => {
    try {
        const products = readExcel('Sheet1');
        const newProduct = req.body;
        newProduct.id = products.length + 1;
        products.push(newProduct);
        writeExcel('Sheet1', products);
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/invoices', (req, res) => {
    try {
        const invoices = readExcel('Sheet2');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/customers', (req, res) => {
    try {
        const customers = readExcel('Sheet3');
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
