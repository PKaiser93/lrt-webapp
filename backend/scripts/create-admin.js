const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const User = require('../models/User')

async function seed() {
    await mongoose.connect(process.env.MONGO_URI)

    const hash = await bcrypt.hash('SZ6.fe01', 10)

    await User.create({
        username: 'patrick',
        password: hash,
        isAdmin: true
    })

    console.log('✅ Neuer User gespeichert')
    process.exit()
}

seed()
