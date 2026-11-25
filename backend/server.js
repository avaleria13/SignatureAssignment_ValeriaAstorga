const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let adoptions;

// Route 1: Get all adoptions
app.get("/api/adoptions", async (req, res) => {
    try {
        const results = await adoptions
            .find()
            .sort({ AdoptionDate: 1 })
            .toArray();

        res.json(results);
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve adoptions."
        });
    }
});

// Route 2: Get adoption by ID
app.get("/api/adoptions/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid adoption ID."
            });
        }

        const result = await adoptions.findOne({
            AdoptionID: id
        });

        if (!result) {
            return res.status(404).json({
                message: "Adoption not found."
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve the adoption."
        });
    }
});

// Route 3: Get adoptions by University ID
app.get("/api/adoptions/university/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid university ID."
            });
        }

        const results = await adoptions
            .find({ UniversityID: id })
            .sort({ AdoptionDate: 1 })
            .toArray();

        res.json(results);
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve university adoptions."
        });
    }
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        await client.connect();

        const db = client.db(process.env.DB_NAME);

        adoptions = db.collection("adoptions");

        console.log("Connected to MongoDB successfully.");

        app.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

startServer();