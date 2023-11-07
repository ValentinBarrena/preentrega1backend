import { Router } from 'express'

const router = Router()
const products = []

function generateProductId() {
    if (products.length === 0) {
        return 1;
    }
    const lastProduct = products[products.length - 1];
    return lastProduct.id + 1;
}

//ENDPOINT

router.get('/', (req, res) => {
    res.status(200).send({ data: products })
})

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = products.find((product) => product.id === productId);

    if (!product) {
        return res.status(400).send({ error: 'Product not finded' });
    }

    res.status(200).send({ product });
})

router.post('/', (req, res) => {
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
})

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
        return res.status(400).send({ error: 'Product not finded' });
    }

    const updatedProduct = req.body;
    updatedProduct.id = productId;

    products[productIndex] = updatedProduct;

    res.status(200).send({updatedProduct});
})

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
    return res.status(400).send({ error: 'Product not finded' });
    }

    products.splice(productIndex, 1);
    res.status(200).send({ message: 'Product successfully removed' });
})

export default router
export {products}
