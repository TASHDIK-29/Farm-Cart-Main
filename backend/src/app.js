import express from "express"
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import router from "./app/routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Serve static uploaded files
const uploadPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadPath));

app.use("/api/v1", router);

app.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to Farm Cart System Server"
    })
})



export default app;