import 'dotenv/config';
import express from 'express';
import connectDB from '../services/db.service.js';
import app from '../app.js';

let isDBConnected = false;

async function ensureDBConnection() {
  if (!isDBConnected) {
    try {
      await connectDB();
      isDBConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection failed', err);
      throw err;
    }
  }
}

export default async function handler(req, res) {
  try {
    await ensureDBConnection();

    app(req, res);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}
