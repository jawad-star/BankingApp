import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import rateLimiter from "./middleware/rateLimiter.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;
app.use(express.json());
app.use(rateLimiter);

app.use("/api/transactions", transactionsRoute);
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on PORT:`, PORT));
});
