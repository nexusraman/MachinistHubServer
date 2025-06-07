import Fan from '../models/fan.js'
import fanRotorInventory from '../models/fanRotorInventory.js'

// Create a single fan
export const createFan = async (req, res) => {
  const fan = req.body
  const newFan = new Fan(fan)

  try {
    await newFan.save()
    res.status(201).json(newFan)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

// Create multiple fans
export const createMultipleFans = async (req, res) => {
  const fans = req.body // expect array of fan objects

  if (!Array.isArray(fans) || fans.length === 0) {
    return res.status(400).json({ message: 'No fan entries provided' })
  }

  try {
    const createdFans = await Fan.insertMany(fans)
    res.status(201).json({ success: true, count: createdFans.length, data: createdFans })
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

export const getFan = async (req, res) => {
  try {
    const fan = await Fan.find()
    res.status(200).json(fan)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Create a single fan rotor
export const createFanRotor = async (req, res) => {
  const fan = req.body
  const newFan = new fanRotorInventory(fan)

  try {
    await newFan.save()
    res.status(201).json(newFan)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

// Create multiple fan rotors
export const createMultipleFanRotors = async (req, res) => {
  const rotors = req.body // expect array of fan rotor objects

  if (!Array.isArray(rotors) || rotors.length === 0) {
    return res.status(400).json({ message: 'No fan rotor entries provided' })
  }

  try {
    const createdRotors = await fanRotorInventory.insertMany(rotors)
    res.status(201).json({ success: true, count: createdRotors.length, data: createdRotors })
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}

export const getFanRotor = async (req, res) => {
  try {
    const fan = await fanRotorInventory.find()
    res.status(200).json(fan)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const deleteFan = async (req, res) => {
  try {
    await Fan.deleteOne({ _id: req.body._id })
    res.status(200).json({ message: 'Fan Deleted' })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const deleteFanRotor = async (req, res) => {
  try {
    await fanRotorInventory.deleteOne({ _id: req.body._id })
    res.status(200).json({ message: 'Fan Rotor Deleted' })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

export const deleteMultipleFans = async (req, res) => {
  const { ids } = req.body; // ids should be an array of fan IDs

  try {
    await Fan.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Fans deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMultipleFanRotors = async (req, res) => {
  const { ids } = req.body; // ids should be an array of fan rotor IDs

  try {
    await fanRotorInventory.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Fan Rotors deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
