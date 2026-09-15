import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";



import connectDB from "./config/db.js";
import adminRouter from "./routes/admin.routes.js";
import candidateRouter from "./routes/candidate.routes.js";


dotenv.config();

const app = express();

// Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.use("/api/admin", adminRouter);
app.use("/api/candidate", candidateRouter);
// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello from the server",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});