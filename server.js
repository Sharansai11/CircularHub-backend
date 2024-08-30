const cors = require('cors');
const express = require('express');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());

// Serve static files from the React app

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
mongoClient.connect(process.env.DATABASE)
    .then(client => {
        // Get database and collections
        const fpdb = client.db('fpdb');
        const staffcollection = fpdb.collection('staffcollection');
        const admincollection = fpdb.collection('admincollection');
        const circularCollection = fpdb.collection('circularCollection');

        // Share collection objects with express app
        app.set('staffcollection', staffcollection);
        app.set('admincollection', admincollection);
        app.set('circularCollection', circularCollection);

        console.log("DB connection success");
    })
    .catch(err => console.log("Error in DB connection", err));

// Import API routes
const staffApp = require('./apis/Staffapi');
const adminApp = require('./apis/Adminapi');

// API routes
app.use('/staff-api', staffApp);
app.use('/admin-api', adminApp);
// app.use('/circular-api', require('./routes/CircularRoute'));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

// Express error handler
app.use((err, req, res, next) => {
    res.status(500).send({ message: "error", payload: err.message });
});

app.get('/', (req, res) => {
    res.send({ message: "sever working" });
})
// Assign port number
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Web server running on port ${port}`));



// const express = require('express');
// const path = require('path');
// const mongoClient = require('mongodb').MongoClient;
// require('dotenv').config(); // Load environment variables

// const app = express();

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../client/dist')));

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Connect to the database
// mongoClient.connect(process.env.DATABASE)
//     .then(client => {
//         // Get database and collections
//         const fpdb = client.db('fpdb');
//         const staffcollection = fpdb.collection('staffcollection');
//         const admincollection = fpdb.collection('admincollection');

//         // Share collection objects with express app
//         app.set('staffcollection', staffcollection);
//         app.set('admincollection', admincollection);

//         console.log("DB connection success");
//     })
//     .catch(err => console.log("Error in DB connection", err));

// // Import API routes
// const staffApp = require('./apis/Staffapi');
// const adminApp = require('./apis/Adminapi');

// // API routes
// app.use('/staff-api', staffApp);
// app.use('/admin-api', adminApp);

// // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

// // Express error handler
// app.use((err, req, res, next) => {
//     res.status(500).send({ message: "error", payload: err.message });
// });

// // Assign port number
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Web server running on port ${port}`));
