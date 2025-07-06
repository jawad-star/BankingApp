import express from "express";

import {
  getTransactionsByUserId,
  postTransactions,
  deleteTransactions,
  getTransactionsSummary,
} from "../controller/transactionsController.js";

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", postTransactions);

router.delete("/:id", deleteTransactions);

router.get("/summary/:userId", getTransactionsSummary);

export default router;
