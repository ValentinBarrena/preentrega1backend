import { Router } from 'express'
import fs from 'fs/promises'

const router = Router()
const PRODUCTS_FILE = 'productos.json'
let products = []

async function loadProducts() {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        products = JSON.parse(data);
    } catch (error) {
        {
            console.error('Error reading products file:', error);
        }
    }
}

async function saveProducts() {
    try {
        const jsonData = JSON.stringify(products, null, 2);
        await fs.writeFile(PRODUCTS_FILE, jsonData, 'utf-8');
    } catch (error) {
        console.error('Error writing products file:', error);
    }
}

loadProducts()

function generateProductId() {
    if (products.length === 0) {
        return 1;
    }
    const lastProduct = products[products.length - 1];
    return lastProduct.id + 1;
}

//ENDPOINTS

router.get('/', async (req, res) => {;
    res.status(200).send({ products });
})

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = products.find((product) => product.id === productId);

    if (!product) {
        return res.status(400).send({ error: 'Product not finded' });
    }

    res.status(200).send({ product });
})

router.post('/', async (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    if (!Array.isArray(thumbnails) || !thumbnails.every((item) => typeof item === 'string')) {
        return res.status(400).send({ error: 'The thumbnails field must be an array of strings' });
    }

    const id = generateProductId()

    const newProduct = {
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    }
    products.push(newProduct)

    await saveProducts()
    res.status(200).send({ newProduct })
})

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return res.status(400).send({ error: 'Product not finded' });
    }

    const updatedProduct = req.body;
    updatedProduct.id = productId;

    products[productIndex] = updatedProduct

    await saveProducts()
    res.status(200).send({updatedProduct});
})

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
    return res.status(400).send({ error: 'Product not finded' });
    }

    products.splice(productIndex, 1);

    await saveProducts()
    res.status(200).send({ message: 'Product successfully removed' });
})

export default router
export {products}
