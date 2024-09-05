const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require('dotenv').config()
app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173', 'https://email-pass-auth-97857.web.app', 'https://email-pass-auth-97857.firebaseapp.com'
    ],
    credentials: true
}));
app.use(cookieParser());
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bogalj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const logger = (req, res, next) => {
    console.log('log: info', req.method, req.url);
    next();
}

const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    // console.log('token in the middleware', token);
    // no token available 
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.user = decoded;
        next();
    })
}

async function run() {
    try {

        // await client.connect();
        const volunteerCollection = client.db("altruisthub").collection("volunteers");
        //volunteer
        const volunteerRequest = client.db("altruisthub").collection("volunteerRequestCollection")
        //testimonial 
        const testimonial = client.db("altruisthub").collection("testimonials")
        //jwt
        app.post('/jwt', logger, async (req, res) => {
            const user = req.body;
            console.log(user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '100d'
            })
            res
                .cookie('token', token, cookieOptions)
                .send({ sucess: true })
        })


        app.post('/logout', async (req, res) => {
            const user = req.body;
            console.log('logging out', user)
            res.clearCookie('token', { ...cookieOptions, maxAge: 0 }).send({ sucess: true })
        })





        app.get('/volunteers', async (req, res) => {

            const searchQuery = req.query.search || "";
            const userEmail = req.query.email || "";
            let query = {
                $and: [
                    {
                        $or: [
                            { postTitle: { $regex: searchQuery, $options: 'i' } },
                            { category: { $regex: searchQuery, $options: 'i' } }
                        ]
                    },

                ]
            }
            if (userEmail) {
                query = {
                    $and: [
                        query,
                        { organizerEmail: userEmail }
                    ]
                };
            }
            const cursor = volunteerCollection.find(query).sort({ "deadline": 1 });

            const result = await cursor.toArray()
            res.send(result)

        })
        app.get("/volunteers/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await volunteerCollection.findOne(query)
            res.send(result)
        })

        app.post('/volunteers', logger, verifyToken, async (req, res) => {
            const newPost = req.body;
            const result = volunteerCollection.insertOne(newPost)
            res.send(result)
        })

        app.patch("/volunteers/:id", async (req, res) => {
            const id = req.params.id;
            const updateDoc = { ...req.body };
            delete updateDoc._id;

            // const result = await volunteerCollection.updateOne({ _id: new ObjectId(id) }, updateDoc)
            // res.send(result)


            if (updateDoc.$inc) {

                const result = await volunteerCollection.updateOne(
                    { _id: new ObjectId(id) },
                    updateDoc
                );
                res.send(result);
            } else {

                const result = await volunteerCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateDoc }
                );
                res.send(result);
            }



        })
        app.delete("/volunteers/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await volunteerCollection.deleteOne(query)
            res.send(result)

        })
        //volunteerRequest
        app.post("/volunteer-request", async (req, res) => {
            const request = req.body;
            const result = await volunteerRequest.insertOne(request)
            res.send(result)
        })
        app.get("/volunteer-request", async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { volunteerEmail: req.query.email }
            }
            const cursor = volunteerRequest.find(query);

            const result = await cursor.toArray()
            res.send(result)
        })
        app.delete("/volunteer-request/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await volunteerRequest.deleteOne(query)
            res.send(result)

        })
        //get testimonials
        app.get("/testimonials", async (req, res) => {
            const cursor = testimonial.find();

            const result = await cursor.toArray()
            res.send(result)

        })
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {


    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("Server is running")
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
