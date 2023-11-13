import { Router } from 'express'
import { products } from './products.routes.js'
import fs from 'fs/promises'

const router = Router()
const CARTS_FILE = 'carrito.json'
let carts = []

function generateCartId() {
    if (carts.length === 0) {
        return 1;
    }
    const lastCart = carts[carts.length - 1];
    return lastCart.id + 1;
}

async function loadCarts() {
    try {
        const data = await fs.readFile(CARTS_FILE, 'utf-8');
        carts = JSON.parse(data);
        return carts;
    } catch (error) {
        console.error('Error reading carts file:', error);
        return [];
    }
}

async function saveCarts() {
    try {
        const jsonData = JSON.stringify(carts, null, 2);
        await fs.writeFile(CARTS_FILE, jsonData, 'utf-8');
    } catch (error) {
        console.error('Error writing carts file:', error);
    }
}

loadCarts()

//ENDPOINTS

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(400).send({ error: 'Cart not found' });
    }

    res.status(200).send(cart.products);
})

router.post('/', async (req, res) => {
    const newCart = {
        id: generateCartId(),
        products: [],
    };
    carts.push(newCart)
    
    await saveCarts()
    res.status(200).send(newCart);
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(400).send({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex((prod) => prod.product === productId);

    const validProduct = products.find((p) => p.id === productId);

    if (!validProduct) {
    return res.status(400).send({ error: 'Product not founded' });
    }

    if (productIndex === -1) {
        cart.products.push({
            product: productId,
            quantity: 1,
        });
    } else {
        cart.products[productIndex].quantity++;
    }

    await saveCarts()
    res.status(200).send(cart.products);
})

export default router