const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const students = require('./Data/studentInfo.json')
app.get('/', (req, res)=>{
    
    res.send(students)
})

app.post('/', (req, res)=>{
    console.log('Data posted to server')
    const user = req.body
    students.push(user)
    res.send(user)
    console.log(user)
   
})

app.listen(port, ()=>{
    console.log('data is running on port :', port)
})