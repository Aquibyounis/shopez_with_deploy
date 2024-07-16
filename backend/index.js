const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

// DB connection with MongoDB
const dbURI = "mongodb+srv://aquib:Luciferbad007@cluster0.b3i4uac.mongodb.net/ShopEZ";
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // Enforce TLS/SSL connection
    tlsAllowInvalidCertificates: true // Temporarily allow invalid certificates
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// API creation
app.get("/", (req, res) => {
    res.send("Welcome to ShopEZ");
});

// Image storage engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Creating endpoint for uploading images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
});

// Schema for creating products
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    availability: {
        type: Boolean,
        default: true,
    }
});

const Product = mongoose.model("Product", productSchema, "products");
// Adding the product
app.post("/addproduct", async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let lastProduct = products[products.length - 1];
            id = lastProduct.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Schema for creating user model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model("User", userSchema);



// Endpoint to get all products
app.get("/allproducts", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
    }
});



// Creating endpoint for registering the user
app.post("/signup", async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the incoming request body

        const { username, email, password } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        // Check if username is provided
        if (!username) {
            return res.status(400).json({ success: false, error: "Username is required" });
        }

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ success: false, error: "Password is required" });
        }

        // Check for existing user
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Existing user found with the same email ID" });
        }

        // Create initial cart data
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create a new user
        const newUser = new User({
            name: username,
            email: email,
            password: password,
            cartData: cart,
        });

        // Save the user to the database
        await newUser.save();

        // Create a token
        const data = {
            user: {
                id: newUser.id
            }
        };

        const token = jwt.sign(data, "secret_ecom");
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Creating endpoint for user login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        if (user.password !== password) { // Plain text comparison (NOT RECOMMENDED)
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        const token = jwt.sign({ user: { id: user.id } }, "secret_ecom", { expiresIn: "1h" });

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


//creating end point for newcollection data.....
app.get("/newcollections",async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("new collection fetched")
    res.send(newcollection); 
})

//creating end point for popular in fashion data.....
app.get("/popularfashion",async(req,res)=>{
    let products=await Product.find({category:"Womens"});
    let popularfashion=products.slice(0,4);
    console.log("popular fashion fetched");
    res.send(popularfashion);
    
})

//creating middleware to fetch user....
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: "Please use valid token" });
    }
    try {
        const data = jwt.verify(token, "secret_ecom");
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate valid token" });
    }
};


//creating endpoint for adding products in cartData......
app.post("/addtocart", fetchUser, async (req, res) => {
    try {
        const { itemID } = req.body;
        const userId = req.user.id;

        if (!itemID) {
            return res.status(400).json({ error: "Item ID is required" });
        }

        // Fetch user data
        let userData = await User.findOne({ _id: userId });

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Current userData.cartData:", userData.cartData);

        // Initialize cartData if it doesn't exist
        if (!userData.cartData) {
            userData.cartData = {};
        }

        // Update the item count
        if (!userData.cartData[itemID]) {
            userData.cartData[itemID] = 0;
        }
        userData.cartData[itemID] += 1;

        console.log(`Updated cartData for itemID ${itemID}:`, userData.cartData[itemID]);

        // Update user data in the database
        await User.findOneAndUpdate({ _id: userId }, { cartData: userData.cartData });

        res.json({ message: "Added", cartData: userData.cartData });
    } catch (error) {
        console.error("Error updating cart data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//creating end point to remove from cart data.......
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const { itemID } = req.body;
        const userId = req.user.id;

        if (!itemID) {
            return res.status(400).json({ error: "Item ID is required" });
        }

        let userData = await User.findOne({ _id: userId });

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        if (userData.cartData[itemID] > 0) {
            userData.cartData[itemID] -= 1;
        } else {
            return res.status(400).json({ error: "Item quantity is already 0" });
        }

        await User.findOneAndUpdate({ _id: userId }, { cartData: userData.cartData });

        // Send updated cart data back to the client
        res.json({ message: "Removed", cartData: userData.cartData });

        console.log("Updated userData:", userData);
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//creating endpoint to store cartData....
app.post("/getcart", fetchUser, async (req, res) => {
    console.log("get cart data")
    let userData = await User.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});
  




// Starting the server
app.listen(port, (error) => {
    if (!error) {
        console.log(`Server running on port ${port}`);
    } else {
        console.log(`Error: ${error}`);
    }
});
