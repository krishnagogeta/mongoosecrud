const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Product = require("./model/Product");
app.use(express.json());
const cors = require('cors');
app.use(express.json());
app.use(cors()); 
let url = require("./url");
//--------------------connection to database-----------------------------------
mongoose.connect(url, { dbName: "capstone" }).then(
  () => {
    console.log("Connection Success");
  },
  (err) => {
    console.log("Connection Failed", err);
  }
);
//---------------fetch products---------------------------------------------------
app.get("/", async (req, res) => {
  const productss = await Product.find();
  return res.json(productss);
});

//-----------------login--------------------------------------------------------
app.post("/login", async (req, res) => {
  const { u_name, upwd } = req.body;

  try {
    const user = await mongoose.connection.db
      .collection("users")
      .findOne({ u_name, upwd });
    if (user) {
      res.json({ auth: "success", user: u_name });
    } else {
      res.json({ auth: "failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Signup ------------------------------------------------------------------
app.post("/signup", async (req, res) => {
  const { u_name, upwd } = req.body;

  console.log("Request Body:", req.body); // Debugging log

  // if (!u_name || !upwd) {
  //   return res.status(400).json({ error: 'u_name and upwd are required' });
  // }
  const user = await mongoose.connection.db
    .collection("users")
    .findOne({ u_name, upwd });
  if (user) {
    res.json("Already a user please login");
  } else {
    try {
      // Get the users collection
      const usersCollection = mongoose.connection.db.collection("users");

      // Insert the new user
      const result = await usersCollection.insertOne({ u_name, upwd });
      console.log("Insert Result:", result); // Debugging log

      // Send success response
      res.json({ auth: "success", user: u_name });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
});
//------------insert to cart-----------------------------------------------------
app.post("/cart",async(req,res)=>{
    const{u_name,p_img,p_id,p_cost} = req.body
    let qty = 1;
    try{
        const cartCollection = mongoose.connection.db.collection("cart")
        const result = await cartCollection.insertOne({ u_name, p_cost,p_id,p_img,qty});
        console.log("Insert Result:", result); // Debugging log

      // Send success response
        res.json("Product inserted Successfully");
    }
    catch(err){
        console.log(err)
    }

})

//----------update cart----------------------------------
app.post("/updatecart", async(req,res) => {
    let p_id = req.body.p_id
	let u_name = req.body.u_name
	let obj = { "qty": req.body.qty }
    try{
        const cartCollection = mongoose.connection.collection("cart")
        cartCollection.updateOne({ p_id, u_name }, { $set: obj },
            (err, result) => {
                if (err)
                    res.json({ 'cartUpdate': 'Error ' + err })
                else {
                    if (result.matchedCount != 0) {
                        console.log(`Cart data for ${u_name} updated`)
                        res.json({ 'cartUpdate': 'success' })
                    }
                    else {
                        console.log(`Record not updated`)
                        res.json({ 'cartUpdate': 'Record Not found' })
                    }
                    //conn.close()
                }
            })

    }
    catch(err){

        console.log(err)
    }
})

app.post('/delteItem', (req,res)=>{
    let p_id = req.body.p_id
	let u_name = req.body.u_name
    try{
        const cartCollection = mongoose.connection.collection("cart")
        cartCollection.deleteOne({p_id,u_name}, (err, result) => {
            if (err)
                res.json({ 'cartDelete': 'Error ' + err })
            else {
                if (result.deletedCount != 0) {
                    console.log(`Cart data from ${u_name} deleted`)
                    res.json({ 'cartDelete': 'success' })
                }
                else {
                    console.log('Cart Data Not deleted')
                    res.json({ 'cartDelete': 'Record Not found' })
                }
                //conn.close()
            }
        })

    }
    catch(err){
        console.log(err)
    }
})
app.listen("8080", () => console.log("running"));