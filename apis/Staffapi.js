//create user api app
const exp = require("express");
const staffApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const VerifyToken = require("../Middlewares/VerifyToken");

require("dotenv").config();

let staffcollection;
let circularCollection;

// let articlescollection;
//get usercollection app
staffApp.use((req, res, next) => {
    staffcollection = req.app.get("staffcollection");
     circularCollection = req.app.get('circularCollection');
    next()
})
staffApp.post('/login', expressAsyncHandler(async (req, res) => {
    //get cred obj from client
    const userCred = req.body;
    console.log(userCred)
    //check for username
    const dbuser = await staffcollection.findOne({ username: userCred.username })
    if (dbuser === null) {
        res.send({ message: "Invalid username" })
    } else {
        //check for password
        const status = await bcryptjs.compare(userCred.password, dbuser.password)
        if (status === false) {
            res.send({ message: "Invalid password" })
        } else {
            //create jwt token and encode it
            const signedToken = jwt.sign({ username: dbuser.username }, process.env.SECRET_KEY, { expiresIn: '1d' })
            //send res
            res.send({ message: "login success", token: signedToken, user: dbuser })
        }
    }
}))


// Assuming circularCollection is properly initialized and imported

staffApp.get('/circulars', VerifyToken, expressAsyncHandler(async (req, res) => {
    try {
        console.log("circular staff api")
        const circularlist = await circularCollection.find().toArray();
        console.log("Circulars fetched successfully:", circularlist);
        res.send({ message: "List of circulars", payload: circularlist });
    } catch (error) {
        console.error("Error fetching circulars:", error);
        res.send({ message: "Error fetching circulars", error: error.message });
    }
}));


// staffApp.get('/circulars', VerifyToken, expressAsyncHandler(async (req, res) => {
    
//     // 
//     try {
//         const circularlist = await circularCollection.find().toArray();
//         // Proceed with further processing if successful
//     } catch (error) {
//         console.error("Error fetching circulars:", error);
//         // Handle the error, e.g., log it, return an error response, etc.
//     }

//     // console.log(circularlist)
//     res.send({ message: "List ofcirculars", payload: circularlist })

// }))
// //get articles of all authors
// staffApp.get(
//     "/articles", verifyToken,
//     expressAsyncHandler(async (req, res) => {
//         //get articlescollection from express app
//         const articlescollection = req.app.get("articlescollection");
//         //get all articles
//         let articlesList = await articlescollection
//             .find({ status: true })
//             .toArray();
//         //send res
//         res.send({ message: "articles", payload: articlesList });
//     })
// );
// staffApp.get('/articles/:articleId', verifyToken, expressAsyncHandler(async (req, res) => {
//     // Extract the article ID from the URL and convert it to a number
//     const articleIdFromUrl = +req.params.articleId;

//     // Get articles whose status is true and match the articleIdFromUrl
//     const articlesList = await articlescollection.find({
//         status: true,
//         articleId: articleIdFromUrl
//     }).toArray();

//     // Send the response
//     res.send({ message: "List of articles", payload: articlesList });
// }));


// //post comments for an arcicle by atricle id
// staffApp.post(
//     "/comment/:articleId", verifyToken,
//     expressAsyncHandler(async (req, res) => {
//         try {
//             // Get user comment object from the request body
//             const userComment = req.body;
//             // Get the article ID from the URL and convert it to a number
//             const articleIdFromUrl = +req.params.articleId;

//             // Insert the userComment object into the comments array of the article by ID
//             let result = await articlescollection.findOneAndUpdate(
//                 { articleId: articleIdFromUrl },
//                 { $addToSet: { comments: userComment } }, // or use $push if you want to always add the comment
//                 { returnOriginal: false } // Option to return the updated document
//             );

//             console.log(result);
//             res.send({ message: "Comment posted", payload: result }); // Return the updated document
//         } catch (error) {
//             console.error("Error posting comment:", error);
//             res.status(500).send({ message: "Failed to post comment", error });
//         }
//     })
// );


//export staffApp
module.exports = staffApp;