const express = require('express');
const sellRouter = express.Router();
const multer = require('multer');
const Seller = require('../model/sell');
const Comment=require('../model/comment');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const sell = multer({ storage });

sellRouter.post('/sell', sell.single('file'), async (req, res) => {
    try {
        const { firstName, secondName, username, password, phone, email, nameCloth, description, price } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: "no image uploaded" });
        }
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: "User ID not found in session" });
        }

        const findEmail = await Seller.findOne({ email });
        if (findEmail) {
            return res.redirect('/allProduct');
        }

        const checkPhone = (phoneNumber) => {
            var regex = /^(?:\+25\s?)?07[8923]\d{3}\d{4}$/;
            return regex.test(phoneNumber);
        }
        if (!checkPhone(phone)) {
            return res.send("Your phone number should match a Rwandan contact.");
        }

        // Ensure userId is provided
        

        const userName = await Seller.findOne({ username });
        if (userName) {
            return res.send("username taken try to find other username");
        }

        const checkUsername = (userName) => {
            var regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9@$%&*^#]*[a-zA-Z]?[a-zA-Z0-9@$%&*^#]*$/;
            return regex.test(userName);
        }
        if (!checkUsername(username)) {
            return res.send('Your username should contain at least one alphanumeric character and may include characters such as "@", "%", "&", and others.');
        }

        // Retrieve comments from the request body
        const { comments } = req.body;

        // Create a new seller
        const seller = new Seller({
            userId,
            firstName,
            secondName,
            username,
            password,
            phone,
            email,
            nameCloth,
            description,
            seller: seller._id,
            price,
            file: req.file.path
        });

        // Save the seller to the database
        await seller.save();

        // If comments are provided, associate them with the seller
        if (comments && comments.length > 0) {
            // Map over the comments and create a new Comment document for each one
            // const sellerId=req.querry;
            const commentDocs = comments.map(comment => new Comment({
                user: userId,
                text: comment.text,
                //  seller:sellerId, // Assign the _id of the seller
                date: new Date() // You may want to adjust this based on how you handle comment dates
            }));
            

            // Save all the comment documents
            await Comment.insertMany(commentDocs);

            // Associate the comments with the seller
            seller.comments = commentDocs.map(comment => comment._id);

            // Save the updated seller document
            await seller.save();
        }

        return res.status(200).send("Product added successfully!");
    }catch (error) {
        // Log the error
        console.error('Error adding comments to seller:', error);
    
        // Send an error response
        return res.status(500).json({ error: 'Internal server error' });
    }});

Seller.schema.post('updateOne', async function(doc) {
    const oldFile = doc.getQuery()._id;
    const newFile = doc._id;

    await Comment.updateMany({ file: oldFile }, { $set: { file: newFile } });
});



/// Inside the sellRouter.get('/seller/:id'...) route handler
// sellRouter.get('/seller/:id', async (req, res) => {
//     const sellerId = req.params.id;
//     try {
//         // Fetch the seller by ID and populate the comments field
//         const seller = await Seller.findById(sellerId).populate('comments');
//         if (!seller) {
//             return res.status(404).send('Seller not found');
//         }

//         // Render the seller details page with the fetched seller data
//         res.render('Detail', { seller });
//     } catch (error) {
//         console.error('Error fetching seller details:', error);
//         res.status(500).send('Internal server error');
//     }
// });




/*........all product removal.......................*/


sellRouter.get('/allProduct', (req, res) => {


        // If the user is logged in, fetch all products and render the index page
        Seller.find()
            .then((result) => {
                res.render('index', { Seller: result });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Internal Server Error');
            });
    
});

sellRouter.get('/allProductUser/:username', async (req, res) => {
    const username = req.params.username;
    try {
        // Query the database for all sellers with the specified username
        const sellers = await Seller.find({ username: username });
        if (!sellers || sellers.length === 0) {
            return res.status(404).send('No sellers found for this username');
        }

        // Extract all file paths from the sellers
        const files = sellers.flatMap(seller => seller.file);

        // Render a page displaying all the files
        res.render('allProductUser', { username: username, files: files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Internal server error');
    }
});
// Define the /dashboard route handler
sellRouter.get('/dashboard', async (req, res) => {
    // Check if the user is logged in
    if (req.session.userId) {
        try {
            // If logged in, fetch products associated with the user
            const userId = req.session.userId;
            const products = await Seller.find({ userId });
            console.log('the id of this product',products)
            // Render the dashboard page with the user's products
            res.render('dashboard', { products });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('Internal server error');
        }
    } else {
        // If not logged in, redirect to the login page
        res.redirect('/login');
    }
});
// Import the Seller model

sellRouter.get('/newProduct', async (req, res) => {
    try {
        // Calculate the date range (from 0 seconds ago to 30 days ago)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Query products created within the last 30 days
        const recentProducts = await Seller.find({
            createdAt: { $gte: thirtyDaysAgo }
        });

        console.log('Recent products yours:', recentProducts); // Debug: Log retrieved products

        res.render('newProduct', { Seller: recentProducts }); // Pass retrieved products to the view
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Issue fetching products from the database" });
    }
});
sellRouter.delete('/delete/:id',(req,res)=>{
    const id=req.params.id;
    Seller.findByIdAndDelete(id).then(()=>res.json({redirect:'/dashboard'}))
})



sellRouter.get('/sellers',async(req,res)=>{
    try{
        const users=await Seller.find();
        return res.json(users)
    }
    catch(err){
        console.error(err);
        return res.json({eror:"it becomes issue to fect all users in data base"})
    }
    })
    sellRouter.delete('/sellers/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const deleteSeller = await Seller.findByIdAndDelete(id);
            if (!deleteSeller) {
                return res.status(404).json({ error: "Seller not found" });
            }
            return res.status(200).json({ message: "Seller deleted successfully" });
        } catch (error) {
            console.error("Error deleting seller:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
    



module.exports = sellRouter;
