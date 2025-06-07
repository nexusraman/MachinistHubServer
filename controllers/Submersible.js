import Clients from '../models/clients.js'
import Submersible from '../models/Submersible.js'
import { nanoid } from 'nanoid' // Import nanoid for generating unique IDs

import rateList from '../utils/RateList.js'; 



export const createSubmersible = async (req, res) => {
  const submersible = req.body;
  const generatedSubId = nanoid();

  const newSub = new Submersible({
    ...submersible,
    subId: generatedSubId
  });

  const client = await Clients.findOne({ name: submersible.client });
  const rate = getRate(submersible.client, submersible.rotorSize);
  const entryAmount = parseInt(submersible.quantity) * rate;

  const entry = {
    subId: generatedSubId,
    date: submersible.date,
    size: submersible.rotorSize,
    quantity: submersible.quantity
  };

  try {
    await Clients.findOneAndUpdate(
      { _id: client._id },
      {
        $push: { entries: entry },
        $inc: { calculatedBalance: entryAmount }
      }
    );
    await newSub.save();

    res.status(201).json(newSub);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const createMultipleSubmersibles = async (req, res) => {
  const submersibles = req.body;

  if (!Array.isArray(submersibles) || submersibles.length === 0) {
    return res.status(400).json({ message: 'No submersible data provided' });
  }

  try {
    const savedSubmersibles = [];

    for (const sub of submersibles) {
      const generatedSubId = nanoid(); // Generate a unique subId for each
      const newSub = new Submersible({
        ...sub,
        subId: generatedSubId
      });

      const client = await Clients.findOne({ name: sub.client });

      const rate = getRate(sub.client, sub.rotorSize);
      const amount = parseInt(sub.quantity) * rate;

      const entry = {
        subId: generatedSubId,
        date: sub.date,
        size: sub.rotorSize,
        quantity: sub.quantity
      };

      if (client) {
        await Clients.findOneAndUpdate(
          { _id: client._id },
          {
            $push: { entries: entry },
            $inc: { calculatedBalance: amount }
          }
        );
      }

      const saved = await newSub.save();
      savedSubmersibles.push(saved);
    }

    res.status(201).json({
      success: true,
      count: savedSubmersibles.length,
      data: savedSubmersibles
    });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


// Get all submersibles
export const getSubmersible = async (req, res) => {
  try {
    const submersible = await Submersible.find()
    res.status(200).json(submersible)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Delete a submersible
export const deleteSub = async (req, res) => {
  try {
    const { subId, clientName } = req.body;

    const specificSub = await Submersible.findOne({ subId, client: clientName });
    if (!specificSub) {
      return res.status(404).json({ message: `Submersible with subId ${subId} and client ${clientName} not found` });
    }

    const client = await Clients.findOne({ name: clientName });
    if (!client) {
      return res.status(404).json({ message: `Client ${clientName} not found` });
    }

    // Calculate amount to subtract
    const rate = getRate(clientName, specificSub.rotorSize);
    const amountToSubtract = parseInt(specificSub.quantity) * rate;

    // Update client: pull entry and adjust calculatedBalance
    await Clients.findOneAndUpdate(
      { _id: client._id },
      {
        $pull: { entries: { subId: subId } },
        $inc: { calculatedBalance: -amountToSubtract }
      },
      { new: true }
    );

    // Delete sub record
    const deleteResult = await Submersible.deleteOne({ subId, client: clientName });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: `Submersible with subId ${subId} and client ${clientName} not found for deletion` });
    }

    res.status(200).json({ message: 'Submersible and linked client entry deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// Delete multiple submersibles and their associated entries
// export const deleteMultipleSubmersibles = async (req, res) => {
//   const { subIds } = req.body; // subIds should be an array of subId (nanoid) strings

//   try {
//     const submersibles = await Submersible.find({ subId: { $in: subIds } });

//     if (submersibles.length === 0) {
//       return res.status(404).json({ message: 'No submersibles found with the given subIds' });
//     }

//     for (const specificSub of submersibles) {
//       const client = await Clients.findOne({ name: specificSub.client });

//       if (client) {
//         const entryIndex = client.entries.findIndex(
//           (entry) =>
//             entry.date.toISOString() === specificSub.date.toISOString() &&
//             entry.size === specificSub.rotorSize &&
//             entry.quantity === specificSub.quantity
//         );

//         if (entryIndex !== -1) {
//           client.entries.splice(entryIndex, 1); // Remove the entry
//           await client.save(); // Save the updated client document
//         }
//       }
//     }

//     // Delete submersibles after removing their client entries
//     await Submersible.deleteMany({ subId: { $in: subIds } });

//     res.status(200).json({ message: 'Submersibles and associated client entries deleted successfully' });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

function getRate(clientName, size) {
  const clientKey = clientName.toLowerCase();
  const rates = rateList[clientKey] || {};
  return rates[size] || 0;
}