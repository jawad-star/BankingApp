import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;
app.use(express.json());

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE DEFAULT CURRENT_DATE
    )`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error  initialized Database", error);
    process.exit(1);
  }
}
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} 

    `;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error creating transactions", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !amount === undefined || !category || !user_id)
      return res.status(400).json({ message: "All Field Are Required" });

    const transaction = await sql`
  INSERT INTO transactions (title,amount,category,user_id)
  VALUES (${title},${amount},${category},${user_id})
  RETURNING *
  `;
    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transactions", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM transactions WHERE id = ${id}`;
    if (result.length === 0)
      res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Delete Successfully" });
  } catch (error) {
    console.log("Error deleting transactions", error);
    res.status(500).json({ message: "Internal Server Error" });
        }
});

app.listen(PORT, () => console.log(`Server is running on PORT:`, PORT));
