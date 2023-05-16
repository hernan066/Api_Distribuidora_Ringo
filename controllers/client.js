const { response } = require('express')
const { Client, Recommendation, ClientAddress, Points } = require('../models')

const getClients = async (req, res = response) => {
  try {
    const { limit = 1000, from = 0 } = req.query
    const query = { state: true }

    const [total, clients] = await Promise.all([
      Client.countDocuments(query),
      Client.find(query)
        .skip(Number(from))
        .limit(Number(limit))
        .populate('clientCategory', ['clientCategory'])
        .populate('user', ['name', 'lastName', 'phone', 'email'])
        .populate('clientType', ['clientType'])
    ])

    res.status(200).json({
      ok: true,
      status: 200,
      total,
      data: {
        clients
      }
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message
    })
  }
}

const getClient = async (req, res = response) => {
  try {
    const { id } = req.params
    const client = await Client.findById(id)
      .populate('clientCategory', ['clientCategory'])
      .populate('user', ['name', 'lastName', 'phone', 'email'])
      .populate('clientType', ['clientType'])

    const points = await Points.find({ state: true, clientId: id })
    const totalPoints = points.reduce((acc, curr) => acc + curr.points, 0)

    const dataClient = client

    const data = {
      ...dataClient._doc,
      points: totalPoints
    }

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        client: data
      }
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message
    })
  }
}

const postClient = async (req, res = response) => {
  try {
    const { state, recommendation, ...body } = req.body

    const clientDB = await Client.findOne({ cuit: body.cuit })

    if (clientDB) {
      return res.status(400).json({
        msg: `El cuit ${clientDB.cuit}, ya existe`
      })
    }

    // Generar la data a guardar
    const data = {
      ...body
    }

    const client = new Client(data)

    if (recommendation) {
      const data = {
        clientId: recommendation,
        recommendedClient: client._id,
        recommendedUser: client.user
      }
      const recomm = new Recommendation(data)

      // Guardar DB
      await recomm.save()
    }

    // Guardar DB
    await client.save()

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        client
      }
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message
    })
  }
}

const putClient = async (req, res = response) => {
  try {
    const { id } = req.params
    const { state, ...data } = req.body

    const client = await Client.findByIdAndUpdate(id, data, { new: true })

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        client
      }
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message
    })
  }
}

const deleteClient = async (req, res = response) => {
  try {
    const { id } = req.params
    await Client.findByIdAndUpdate(id, { state: false }, { new: true })

    res.status(200).json({
      ok: true,
      status: 200
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message
    })
  }
}

const getUserClient = async (req, res = response) => {
  try {
    const { id } = req.params
    const client = await Client.find({ user: id, state: true })

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        client
      }
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message
    })
  }
}
const getAddressesClient = async (req, res = response) => {
  try {
    const { id } = req.params
    const clientAddress = await ClientAddress.find({ client: id, state: true })

    res.status(200).json({
      ok: true,
      status: 200,
      data: {
        clientAddress
      }
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      status: 500,
      msg: error.message
    })
  }
}

module.exports = {
  postClient,
  getClients,
  getClient,
  putClient,
  deleteClient,
  getUserClient,
  getAddressesClient
}
