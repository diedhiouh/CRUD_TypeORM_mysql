import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import {Express} from "express"

import express = require("express")
import bodyParser = require("body-parser")

let app = express();


app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const userRepo = AppDataSource.getRepository(User);
AppDataSource.initialize();

// let listuser ;
// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timbere"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)
//     listuser = users

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))

app.get('/', async (req,res)=>{

    await userRepo.find().then((response) => {
        res.send({
            'users': response
        });
    })
    .catch((error) => res.json({error: error}));
})
  

app.get('/:id', async (req,res) =>{
    // const id = {id: req.params.id}
    let payload  = parseInt(req.params.id);
    
    await userRepo.findOne({where: { id: payload } })
    .then((response)=>{
        res.send({
            'message': 'user found successfully',
            'user': response
        })
    })
    .catch((error) => res.json({error: error}))
    
})
    
app.post("/", async (req, res)=>{

    const luser = req.body;
    console.log(luser)
    const usercreation =  userRepo.create(luser);
    await userRepo.save(usercreation)
    .then((response) =>{
        res.send({
            'message': 'user created',
            'user': response
        })
    })
    .catch((error) => res.json({error: error}))

   
})

app.put('/:id', async(req, res) => {

    let payload = req.body;

    const user = await userRepo.findOne({where:{id: parseInt(req.params.id)}});

    const resultat = await userRepo.merge(user, payload);

    userRepo.save(user)
    .then(() => {
        res.send({
            messsage: 'user updated',
            'user': resultat
        })
    })
    .catch((error) => res.json({error: error}))


   
})

app.delete('/:id', async (req, res) => {

    await userRepo.delete(parseInt(req.params.id))
    .then((response) => {

        res.send({
            'message' : 'User Deleted',
            'user': response
        })
    })
    .catch((error) => res.json({error: error}))


    
})

const PORT = process.env.PORT || '3000'

app.listen(PORT ,() => {
    console.log('listing port ' + PORT)
});
