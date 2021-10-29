const express = require("express")
const cors = require("cors")
const { MongoClient } = require('mongodb');
const objectid = require("mongodb").ObjectId  /* single service dekanir lagi */
require('dotenv').config()

const app = express()
const port = process.env.port || 5000

// middileware
app.use(cors())
app.use(express.json())  /* very very importants middleware */

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5tec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; /* ekhta .env file theke use kora hoyese */

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("carMechanic")
        const servicesCollection = database.collection("services")

        // Get API 
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // Get Single Service
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id
            console.log("jot", id)
            const query = { _id: objectid(id) } /* upore object id require korte hobe */
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        // POST API
        app.post("/services", async (req, res) => {
            const service = req.body
            const result = await servicesCollection.insertOne(service)
            // console.log(result)
            res.json(result)
        })

        // Delete Api 
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: objectid(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }
}

run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("Hello world")
})


app.listen(port, () => {
    console.log("Hitting from Genius car", port)
})