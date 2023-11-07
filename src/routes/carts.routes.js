import { Router } from 'express'
import { products } from './products.routes.js'

const router = Router()
const carts = []

function generateCartId() {
    if (carts.length === 0) {
        return 1;
    }
    const lastCart = carts[carts.length - 1];
    return lastCart.id + 1;
}

//ENDPOINTS

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(400).send({ error: 'Cart not found' });
    }

    res.status(200).send(cart.products);
})

router.post('/', (req, res) => {
    const newCart = {
        id: generateCartId(),
        products: [],
    };
    carts.push(newCart);
    res.status(200).send(newCart);
})

router.post('/:cid/product/:pid', (req, res) => {
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

    res.status(200).send(cart.products);
})



export default router