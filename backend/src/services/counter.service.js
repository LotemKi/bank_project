import mongoose from 'mongoose';

export async function getNextId(name) {
  const result = await mongoose.connection
    .collection('counters')
    .findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      {
        upsert: true,
        returnDocument: 'after', // MongoDB >= 4
        // returnOriginal: false // uncomment if using driver <4
      }
    );

  // fallback for driver differences
  const doc = result?.value || result; // result may be the doc directly

  if (!doc || typeof doc.seq !== 'number') {
    throw new Error(`Failed to get next ID for "${name}"`);
  }

  return doc.seq;
}

