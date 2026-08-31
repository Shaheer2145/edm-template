import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import templateRoutes from "./src/routes/email.routes.js";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.use(templateRoutes());
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
