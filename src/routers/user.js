const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account');
const router = new express.Router();

const upload = multer({
    //dest:'avatar',
    limits:{
        fileSize:1000000 // 1MB
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be jpg,jpeg,png'))
        }

        cb(undefined,true)
    }
})

router.post('/users',async(req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        sendWelcomeEmail(user.email,user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send(error)
    }
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

router.post("/users/login",async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        // res.send({user: user.getPublicProfile(), token});
        // res.set('Authorization',token);
        res.send({user, token});
    }catch(e){
        res.status(400).send()
    }
})

router.post("/users/logout",auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token//return will remove tokens not equal
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post("/users/logoutAll",auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.get('/users/profile',auth,async(req,res)=>{
   res.send(req.user)
})

// router.get("/users/:id",async(req,res)=>{
//     const _id = req.params.id

//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send('No user with that data exists!') 
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send('No user with that data exists!')
//     //     }
//     //     res.status(200).send(user)
//     // }).catch((error)=>{
//     //     res.status(500).send(error)
//     // })
// })

router.patch("/users/profile",auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send("Invalid Update!")
    }

    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save();
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete("/users/profile",auth,async(req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        sendCancelationEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post("/users/profile/avatar",auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width:250,height:250 }).png().toBuffer()
    req.user.avatar =  buffer
   await req.user.save()
   res.send()
},(error,req,res,next)=>{
    res.status(400).send({ error:error.message })
})

router.delete("/users/profile/avatar",auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get("/users/:id/avatar",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

//<img src="data:img/jpg;base64,(paste binary code)">
module.exports = router