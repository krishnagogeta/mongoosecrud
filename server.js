const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const url = require('./url');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 8080;

//set JSON as MIME type
app.use(bodyParser.json());

//client is not sending form data -> encoding JSON
app.use(bodyParser.urlencoded({ extended: true }));

//enable CORS -> Cross Origine Resource Sharing -> communication among various ports
app.use(cors());


mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB...', err));


const userSchema = new mongoose.Schema({
    u_name: String,
    u_pwd: String
});

const productSchema = new mongoose.Schema({
    p_id: Number,
    p_name: String,
    p_cost: Number,
    p_category: String,
    p_description: String,
    p_url: String
});

const cartSchema = new mongoose.Schema({
    p_id: Number,
    p_name: String,
    p_cost: Number,
    p_category: String,
    p_description: String,
    p_url: String,
    p_count: Number
});

    
const User = mongoose.model('users', userSchema);
const Product = mongoose.model('products', productSchema);
const Cart = mongoose.model('carts', cartSchema);



app.get('/login', async (req, res) => {
    const {u_name, u_pwd} = req.body;

    try {
        const user = await User.find({
            u_name: u_name,
            u_pwd: u_pwd
        });

        if(user.length > 0) // record found
            res.send('Login Success');
        else
            res.status(401).send('Login Fail');
    }
    catch(err) {
        res.status(500).json({ message: 'Error occurred', error: err.message });
    }
});


app.post('/signup', async (req, res) => {
    const {u_name, u_pwd} = req.body;

    if (!u_name || !u_pwd) {
        return res.status(400).send('Username and Password are required');
    }

    try {
        const findUsers = await User.find({ u_name: u_name });

        if(findUsers.length > 0)  // If the username already exists
            return res.status(400).send('Username already exists.');

        const newUser = User.create({
            "u_name": u_name,
            "u_pwd": u_pwd
        });

        res.status(201).send({ message: 'User created'});
    }
    catch(err) {
        // console.log(err);
        res.status(500).send({ message: 'Error occurred', error: err.message });
    }
});




app.get('/fetch', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    }
    catch (err) {
        // console.log(err);
        res.status(500).send(err);
    }
});



app.get('/cart', async (req, res) => {
    try {
        const cartDetails = await Cart.find();
        // console.log(cartDetails);
        res.json(cartDetails);
    }
    catch(err) {
        res.status(500).send(err);
    }
});


app.post('/cart/add', async (req, res) => {
    const p_id = req.body.p_id;
    let response = await Product.findOne({"p_id": p_id});
    let product = response.toObject();
    product.p_count = 1;
    console.log(product);
    const cartItem = new Cart(product);
    await cartItem.save();

    res.status(200).send({'message': 'Item added to cart', 'cart-item': cartItem});
});


app.put('/cart/update', async (req, res) => {
    const {p_id, p_cost, p_count} = req.body;

    const updatedData = {
        p_count: p_count,
        p_cost: p_cost * p_count
    };

    try {
        const response = await Cart.updateOne({p_id: p_id}, updatedData);
        
        console.log(response);

        if(response.matchedCount == 0)
            return res.status(404).send('Cart Item Not Found');
        if(response.modifiedCount > 0)
            return res.status(200).send({p_id: p_id, updatedData});
        else
            return res.status(200).send({message: 'No Update Needed'});
    }
    catch(err) {
        res.status(500).send({message: 'Error occurred', error: err.message});
    }
});


app.delete('/cart/delete', async (req, res) => {
    const {p_id} = req.body;

    try {
        const response = await Cart.deleteOne({p_id: p_id});

        console.log(response);

        if(response.deletedCount > 0)
            res.status(200).send({ message: 'Cart item deleted successfully' });
        else
        res.status(404).send({ message: 'Cart item not found' });
    }
    catch(err) {
        res.status(500).send({message: 'Error occurred', error: err.message});
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});