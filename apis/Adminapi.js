//create author api app
const exp = require('express');
const adminApp = exp.Router();
const expressAsyncHandler = require('express-async-handler')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const VerifyToken = require("../Middlewares/VerifyToken");


let admincollection;
let staffcollection;
let circularCollection;

// let staffcollection;
//get usercollection app
adminApp.use((req, res, next) => {
    admincollection = req.app.get('admincollection');
    staffcollection = req.app.get("staffcollection");
    circularCollection = req.app.get('circularCollection');
    // staffcollection = req.app.get('staffcollection')
    next();
})

//author login
adminApp.post('/login', expressAsyncHandler(async (req, res) => {
    //get cred obj from client
    const userCred = req.body;

    //check for username
    const dbuser = await admincollection.findOne({ username: userCred.username })
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


//user registration route
adminApp.post(
    "/staff", VerifyToken,
    expressAsyncHandler(async (req, res) => {
        //get user resource from client
        const newUser = req.body;
        //check for duplicate user based on username
        const dbuser = await staffcollection.findOne({ username: newUser.username });
        //if user found in db
        if (dbuser !== null) {
            res.send({ message: "User existed" });
        } else {
            //hash the password
            const hashedPassword = await bcryptjs.hash(newUser.password, 6);
            //replace plain pw with hashed pw
            newUser.password = hashedPassword;
            //create user
            await staffcollection.insertOne(newUser);
            //send res
            res.send({ message: "User created" });
        }
    })
);

adminApp.post(
    "/admin", VerifyToken,
    expressAsyncHandler(async (req, res) => {
        //get user resource from client
        const newUser = req.body;
        //check for duplicate user based on username
        const dbuser = await admincollection.findOne({ username: newUser.username });
        //if user found in db
        if (dbuser !== null) {
            res.send({ message: "User existed" });
        } else {
            //hash the password
            const hashedPassword = await bcryptjs.hash(newUser.password, 6);
            //replace plain pw with hashed pw
            newUser.password = hashedPassword;
            //create user
            await admincollection.insertOne(newUser);
            //send res
            res.send({ message: "User created" });
        }
    })
);








adminApp.put('/delete-user', VerifyToken, expressAsyncHandler(async (req, res) => {


    //get user
    const userToDelete = req.body;
    let dbuser = await staffcollection.findOne({ username: userToDelete.username })
    console.log(userToDelete)
    if (dbuser) {

        let modifiedArt = await staffcollection.updateOne({ username: dbuser.username }, { $set: { status: false } })
        res.send({ message: "User deleted" })
    }
    else {

        res.send({ message: "user does not exists" })
    }
}

))
// Route to handle POST request for adding a circular
adminApp.post('/upload-circular', expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    const newCir = req.body;

    //post to artciles collection
    await circularCollection.insertOne(newCir);
    //send res
    res.send({ message: "New article created" })



}
)
);

// Soft delete circular
adminApp.put('/delete-circular', VerifyToken, expressAsyncHandler(async (req, res) => {
    const { fileurl } = req.body;
    console.log(fileurl);
    try {
        const modifiedCircular = await circularCollection.updateOne(
            { fileurl: fileurl },
            { $set: { status: false } }
        );
        if (modifiedCircular.modifiedCount === 1) {
            res.send({ message: "Circular deleted successfully" });
        } else {
            res.status(404).send({ message: "Circular not found" });
        }
    } catch (error) {
        console.error("Error deleting circular:", error);
        res.status(500).send({ message: "Failed to delete circular" });
    }
}));

// Restore circular
adminApp.put('/restore-circular', VerifyToken, expressAsyncHandler(async (req, res) => {
    const { fileurl } = req.body;
    console.log(fileurl);
    try {
        const modifiedCircular = await circularCollection.updateOne(
            { fileurl: fileurl },
            { $set: { status: true } }
        );
        if (modifiedCircular.modifiedCount === 1) {
            res.send({ message: "Circular restored successfully" });
        } else {
            res.status(404).send({ message: "Circular not found" });
        }
    } catch (error) {
        console.error("Error restoring circular:", error);
        res.status(500).send({ message: "Failed to restore circular" });
    }
}));

//export userApp
module.exports = adminApp;



