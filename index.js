const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
app.use(express.json())
app.use(cors())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bogalj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        await client.connect();
        const volunteerCollection = client.db("altruisthub").collection("volunteers");
        //volunteer
        const volunteerRequest = client.db("altruisthub").collection("volunteerRequestCollection")
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

        app.post('/volunteers', async (req, res) => {
            const newPost = req.body;
            const result = volunteerCollection.insertOne(newPost)
            res.send(result)
        })
        //volunteerRequest
        app.post("/volunteer-request", async (req, res) => {
            const request = req.body;
            const result = await volunteerRequest.insertOne(request)
            res.send(result)
        })
        app.patch("/volunteers/:id", async (req, res) => {
            const id = req.params.id;
            const updateDoc = req.body
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
        await client.db("admin").command({ ping: 1 });
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
