const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

// REGISTER
router.post("/register", async (req, res) => {

  try {

    const { email, password } = req.body

    // Check existing user
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = new User({
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.json({
      message: "User registered"
    })

  } catch (error) {
    res.status(500).json(error)
  }
})


// LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      })
    }

    // Compare password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    )

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password"
      })
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      "secretkey"
    )

    res.json({
      token,
      userId: user._id
    })

  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
