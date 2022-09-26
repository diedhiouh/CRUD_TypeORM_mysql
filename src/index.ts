import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

import express = require("express")
import bodyParser = require("body-parser")

// init express
let app = express();


// set Middleware bodyparser
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

// init datasource
AppDataSource.initialize();

// init user repository 
const userRepo = AppDataSource.getRepository(User);

// Get all users
app.get('/', async (req,res)=>{

    await userRepo.find().then((response) => {
        res.send({
            'users': response
        });
    })
    .catch((error) => res.json({error: error}));
})
  
// Get one user
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
    
// Add new user
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

   
});


//update user data
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

// remove user
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

// set PORT default app
const PORT = process.env.PORT || '3000'

// config lsitening port
app.listen(PORT ,() => {
    console.log('listing port ' + PORT)
});
