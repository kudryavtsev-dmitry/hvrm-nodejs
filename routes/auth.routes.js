const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const pool = require('../db/pg.js')
const { check, validationResult } = require('express-validator')

const router = Router()

// api/auth/authenticate

router.post(
  '/authenticate',
  [
    check('login', 'login is empty').notEmpty(),
    check('password', 'password should be not empty and more than 3 symbols').notEmpty().isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { login, password } = req.body

      const isUser = await pool.query('select * from users where login = $1 and password = $2', [
        login,
        password,
      ])

      const {firstname, lastname, email} = isUser.rows[0]

      if (!isUser.rowCount) {
        return res.status(401).json({ message: 'Unauthorized' })
      }


      const token = jwt.sign({ login: login }, config.get('jwtSecret'), {
        expiresIn: '1000',
      })

      res.status(200).json({ jwt: token, login: login, firstName : firstname, lastName: lastname, email:email })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request' })
    }
  },
)

router.post(
  '/registration',
  [
    check('login', 'login is empty').notEmpty(),
    check('password', 'password should be not empty and more than 3 symbols').notEmpty().isLength({
      min: 3,
    }),
    check('email', 'incorrect email').notEmpty().isEmail(),
    check('firstName', 'login is empty').notEmpty().isString(),
    check('lastName', 'login is empty').notEmpty().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { login, password, email, firstName, lastName } = req.body

      const checkLogin = await pool.query('SELECT id FROM users WHERE login = $1', [login])
      const checkEmail = await pool.query('SELECT id FROM users WHERE email = $1', [email])

      if (checkLogin.rowCount !== 0 || checkEmail.rowCount !== 0) {
        return res.status(409).json({ message: 'login or email already exist' })
      }

      await pool.query(
        'INSERT INTO users (login, password, firstName, lastName, email) VALUES ($1, $2, $3, $4, $5)',
        [login, password, firstName, lastName, email],
      )

      const token = jwt.sign({ login: login }, config.get('jwtSecret'), {
        expiresIn: '1000',
      })

      res.status(200).json({ jwt: token, login: login })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request' })
    }
  },
)

module.exports = router
