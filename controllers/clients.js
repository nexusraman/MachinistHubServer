import Clients from '../models/clients.js'

// Get ALL clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Clients.find()
    res.status(200).json(clients)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Get SINGLE client by ID
export const getClientById = async (req, res) => {
  const { id } = req.params

  try {
    const client = await Clients.findById(id)
    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    res.status(200).json(client)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Create NEW client
export const createClient = async (req, res) => {
  const client = req.body
  const newClient = new Clients(client)

  try {
    await newClient.save()
    res.status(201).json(newClient)
  } catch (err) {
    res.status(409).json({ message: err.message })
  }
}
