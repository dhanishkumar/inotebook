const connectToMongo=require('./db');
const express = require('express')

connectToMongo();
const app = express()
const port = 3000

app.use(express.json())

//Avaible Routes
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/notes', require('./Routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})