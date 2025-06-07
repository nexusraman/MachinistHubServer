import mongoose from 'mongoose'
import Expense from '../models/expense.js'
import Income from '../models/income.js'
import Client from '../models/clients.js'
import { nanoid } from 'nanoid' // Import nanoid for generating unique IDs

// CREATE INCOME
// CREATE INCOME
export const createIncome = async (req, res) => {
  const {
    client: clientName,
    reason,
    amount,
    date,
    medium,
    transferMethod,
    comment
  } = req.body;

  const paymentId = nanoid();

  const newIncome = new Income({
    paymentId,
    client: clientName,
    reason,
    amount,
    date,
    medium,
    transferMethod: medium === 'Transfer' ? transferMethod : undefined,
    comment
  });

  console.log('Creating income for client:', newIncome);
  try {
    const client = await Client.findOne({ name: clientName });
    console.log(client)
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // Check and set calculatedBalance if zero or undefined
    if (client.calculatedBalance === 0 || client.calculatedBalance === undefined) {
      client.calculatedBalance = client.balance;
    }

    // Subtract amount from calculatedBalance
    client.calculatedBalance -= amount;

    //Push payment entry
    client.payments.push({ date, amount, paymentId, medium, transferMethod: medium === 'Transfer' ? transferMethod : undefined,
  comment: comment || '', });

    await client.save({ validateModifiedOnly: true });
    await newIncome.save();

    res.status(201).json(newIncome);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
 
export const bulkCreateIncome = async (req, res) => {
  const incomes = req.body; // Expect array of income objects

  try {
    const savedIncomes = [];

    for (const data of incomes) {
      const {
        client: clientName,
        reason,
        amount,
        date,
        medium,
        transferMethod,
        comment
      } = data;

      const paymentId = nanoid();

      const newIncome = new Income({
        paymentId,
        client: clientName,
        reason,
        amount,
        date,
        medium,
        transferMethod: medium === 'Transfer' ? transferMethod : undefined,
        comment
      });

      const client = await Client.findOne({ name: clientName });
      if (client) {
        // Check and set calculatedBalance if zero or undefined
        if (client.calculatedBalance === 0 || client.calculatedBalance === undefined) {
          client.calculatedBalance = client.balance;
        }

        // Subtract amount from calculatedBalance
        client.calculatedBalance -= amount;

        // Push payment entry
      client.payments.push({ date, amount, paymentId,  transferMethod: medium === 'Online' ? transferMethod : undefined,
  comment: comment || '', });

    await client.save({ validateModifiedOnly: true });
      }

      await newIncome.save();
      savedIncomes.push(newIncome);
    }

    res.status(201).json(savedIncomes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// CREATE EXPENSE
export const createExpense = async (req, res) => {
  const {
    payee,
    reason,
    amount,
    date,
    medium,
    transferMethod,
    comment
  } = req.body

  const newExpense = new Expense({
    payee,
    reason,
    amount,
    date,
    medium,
    transferMethod: medium === 'Transfer' ? transferMethod : undefined,
    comment
  })

  try {
    await newExpense.save()
    res.status(201).json(newExpense)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// BULK CREATE EXPENSES
export const bulkCreateExpense = async (req, res) => {
  const expenses = req.body // Expect array of expense objects
  try {
    const savedExpenses = await Expense.insertMany(
      expenses.map(exp => ({
        payee: exp.payee,
        reason: exp.reason,
        amount: exp.amount,
        date: exp.date,
        medium: exp.medium,
        transferMethod: exp.medium === 'Transfer' ? exp.transferMethod : undefined,
        comment: exp.comment
      }))
    )
    res.status(201).json(savedExpenses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// GET ALL EXPENSES (sorted by date desc)
export const getExpense = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 })
    res.status(200).json(expenses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// GET ALL INCOMES (sorted by date desc)
export const getIncome = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ date: -1 })
    res.status(200).json(incomes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// GET TOTAL EXPENSE AMOUNT
export const getTotalExpense = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const total = result[0]?.total || 0
    res.status(200).json({ total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// GET TOTAL INCOME AMOUNT
export const getTotalIncome = async (req, res) => {
  try {
    const result = await Income.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    const total = result[0]?.total || 0
    res.status(200).json({ total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// GET ALL CLIENTS (sorted alphabetically by name)
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ name: 1 })
    res.status(200).json(clients)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

// DELETE AN ENTRY (expense or income)
export const deleteEntry = async (req, res) => {
  const { _id, category } = req.body;

  if (!['expense', 'income'].includes(category)) {
    return res.status(400).json({ message: 'Invalid type. Must be "expense" or "income".' });
  }

  try {
    if (category === 'expense') {
      await Expense.deleteOne({ _id });
      return res.status(200).json({ message: 'Expense Deleted' });
    }

    if (category === 'income') {
      const income = await Income.findById(_id);
      if (!income) return res.status(404).json({ message: 'Income not found' });

      const { client: clientName, paymentId, amount } = income;

      if (!paymentId) {
        return res.status(400).json({ message: 'Income record missing paymentId.' });
      }

      const client = await Client.findOne({ name: clientName });
      if (client) {
        // Remove the payment entry matching by paymentId
        client.payments = client.payments.filter(p => p.paymentId !== paymentId);

        // Subtract the income amount from calculatedBalance
        client.calculatedBalance = (client.calculatedBalance || 0) + parseInt(amount);

        await client.save({ validateModifiedOnly: true });
      }

      await Income.deleteOne({ _id });
      return res.status(200).json({ message: 'Income Deleted and client balance updated' });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
