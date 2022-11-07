const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zvdscch.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        console.log("database connected")
    } catch(error){
        console.log(error.name, error.message)
        res.send({
            success: false,
            error: error.message
        })
    }
}
run().catch(error=>console.error(error))

const User = client.db("StudentInformation").collection('student')

//endpoint for create data
app.post('/users', async(req, res)=>{
    try{
        const result = await User.insertOne(req.body)
        if(result.insertedId){
            res.send({
                success: true,
                message: `Successfully user created with name - ${req.body.name} and id - ${result.insertedId}`
            })
        } else{
            res.send({
                success: false,
                error: "Data creation failed"
            })
        } 
    }catch(error){
        console.log(error.name, error.message)
        res.send({
            success: false,
            error: error.message
        })
    }
})

//endpoint for read/get data
app.get('/users', async(req, res)=>{
   try{
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const cursor = User.find({})
        const users = await cursor.skip(page*size).limit(size).toArray()
        const count = await User.estimatedDocumentCount()
        console.log(page, size)
        res.send({
            success: true,
            data : {count, users}
        })
   } catch(error){
    console.log(error.name, error.message)
    res.send({
        success: false,
        error: error.message
    })
   }
})

//Delete data
app.delete('/users/:id', async(req, res)=>{
    const {id} = req.params
    try{
        const user = await User.findOne({_id: ObjectId(id)})
        if(!user?._id){
            res.send({
                success: false,
                error: "User doesnt exist"
            })
            return
        }

        const result = await User.deleteOne({_id: ObjectId(id)})
        if(result.deletedCount){
            res.send({
                success: true,
                message: `Successfully Deleted the Data with name - ${user.name}`
            })
        } else{
            res.send({
                success: false,
                error:"Product Deletion is not successful"
            })
        }
    } catch(error){
        console.log(error.message)
    }
})

//Udpade data
 app.get("/users/:id", async(req, res)=>{
    try {
        const {id }= req.params
        const user = await User.findOne({_id: ObjectId(id)})
        res.send({
            success: true,
            data: user
        })

    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
 })

 app.patch("/users/:id", async(req, res)=>{
    const {id} = req.params
    const filter = {_id:ObjectId(id)}
    const user = req.body
    const option = {upsert:true}
    const updatedUser = {
        $set: {
            name: user.name,
            address: user.address,
            email: user.email
        }
    }
    try {
      const result = await User.updateOne({_id: id}, updatedUser, option)
      
      console.log(req.body)
      if(result){
        res.send({
            success: true,
            message: `Data successfully updated of the user- ${req.body.name}`,
            data: result
            
            
        })
      } else{
        res.send({
            success:false,
            error:"Update Failed"
        })
      }
    } catch (error) {
        res.send({
            success:false,
        error:error.message
        })
    }
 })

// const students = require('./Data/studentInfo.json')
// app.get('/', (req, res)=>{
    
//     res.send(students)
// })

// app.post('/', (req, res)=>{
//     console.log('Data posted to server')
//     const user = req.body
//     students.push(user)
//     res.send(user)
//     console.log(user)
   
// })

app.listen(port, ()=>{
    console.log('data is running on port :', port)
})