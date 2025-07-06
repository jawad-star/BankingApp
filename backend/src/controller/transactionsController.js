import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
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
}

export async function postTransactions(req, res) {
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
}

export async function deleteTransactions(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const result =
      await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Delete Successfully" });
  } catch (error) {
    console.log("Error deleting transactions", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getTransactionsSummary(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    Select COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId} 
      `;
    const incomeResult = await sql`
       Select COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
         `;
    const expensesResult = await sql`
       Select COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
         `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error Getting Summary", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
