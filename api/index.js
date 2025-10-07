import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://educontact-22f5a.web.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());
const userName = process.env.DB_NAME
const password = process.env.DB_PASSWORD


const uri = `mongodb+srv://${userName}:${password}@cluster0.b3nlp4l.mongodb.net/`;

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
        const db = client.db("eduContact");
        const eduContactCollageConnection = db.collection("collages");
        const eduContactAdmissionConnection = db.collection("admission");
        const eduContactUserConnection = db.collection("user");
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB connected and collections initialized!");

        app.post("/user", async (req, res) => {
            try {
                const result = await eduContactUserConnection.insertOne(req.body);
                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ error: "Insert failed" });
            }
        });

        app.get("/user", async (req, res) => {
            try {
                const email = req.query.email;
                if (email) {
                    const query = { email: email };
                    console.log('query data', query);
                    const user = await eduContactUserConnection.findOne(query);
                    console.log('user Data', user);
                    if (!user) {
                        return res.status(404).json({ message: "User not found" });
                    }

                    return res.json(user);
                } else {
                    const result = await eduContactUserConnection.find().toArray();
                    return res.json(result);
                }
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: "Server error", error: err });
            }
        });


        app.post("/collages", async (req, res) => {
            try {
                const result = await eduContactCollageConnection.insertOne(req.body);
                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ error: "Insert failed" });
            }
        });

        app.get("/collages", async (req, res) => {
            const result = await eduContactCollageConnection.find().toArray();
            res.json(result);
        });
        app.post("/admission", async (req, res) => {
            try {
                console.log(req.body);
                const result = await eduContactAdmissionConnection.insertOne(req.body);
                console.log(result);
                res.status(201).json(result);
            } catch (err) {
                res.status(500).json({ error: "Insert failed" });
            }
        });

        app.get("/admission", async (req, res) => {
            const result = await eduContactAdmissionConnection.find().toArray();
            res.json(result);
        });

    } catch (err) {
        console.log('backend data error is ', err);
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
