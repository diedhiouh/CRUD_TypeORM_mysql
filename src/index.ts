import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import {Express} from "express"

import express = require("express")
import bodyParser = require("body-parser")

let app = express();


app.use(bodyParser.urlencoded({extended: false}));
const userRepo = AppDataSource.getRepository(User);

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
    res.send({
        'users': await userRepo.find()
    })
});

app.get('/:id', async (req,res) =>{
    // const id = {id: req.params.id}
    let payload  = 1;
    const user = await userRepo.findOne({where: { id: payload } })
    res.json({
        'message': 'succes',
        'user': user
    })
})
    
app.post('/', async (req, res)=>{

    const user = req.body;

    const usercreation = await userRepo.create(user);
    const resultat = await userRepo.save(usercreation);

    res.json({
        'message': 'user created',
        'user': resultat
    })
})

app.listen(process.env.PORT || '3000');
