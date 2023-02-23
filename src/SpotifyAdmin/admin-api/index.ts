const express = require('express')
const authMiddleware = require('./middleware/authMiddleware')
const cors = require('cors');
const userRouter = require('./routes/user.routes')
const contentRouter = require('./routes/content.routes')
const authRouter = require('./routes/auth.routes')
const swaggerUi = require ('swagger-ui-express')
const swaggerDoc = require ('./swagger/openapi.json')
const morgan = require('morgan');
const path = require('path')
const PORT = 8080

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'));

app.use('/api/assets', express.static('assets'))
app.use('/api/user', authMiddleware, userRouter)
app.use('/api/content', authMiddleware, contentRouter)
app.use('/api/auth', authRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.listen(PORT, () => console.log(`Server started on ${PORT}`))