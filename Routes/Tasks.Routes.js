'use strict'
//models
const User = require('../Models/Users');
const Tasks = require('../Models/Tasks');
const History = require('../Models/History');


const express = require('express'),
      app = express.Router()

const nodemailer = require('nodemailer');


app.get('/',(req,res)=>{
    res.json({response:'hola'})
})

app.put('/register',async(req,res)=>{
    const {name, lastName ,roll, email, password} = req.body
    var resObj    
    await User.findOne({email:email},(err,obj)=>{
        resObj = obj
    })
    if(resObj !== null){
        return res.json({status:100})   
    }
    console.log(resObj)

    const user = new User({name, lastName ,roll, email, password})
    await user.save()
    var resObj    
    await User.findOne({email:email},(err,obj)=>{
        resObj = obj
    })
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
            user:'juanse0421@gmail.com',
            pass:'pia042199'
        }
    });
    
    let mailOptions = {
        from: 'juanse0421@gmail.com',
        to: 'juanse0421@gmail.com',
        subject: name+' esta pidiendo autorizacion para acceder a front panel app',
        text: name+' '+lastName+' Esta pidiendo a autorizacion, se la puedes conceder en este link'+'\nhttp://181.54.182.7:8080/'+resObj._id
    }
    transporter.sendMail(mailOptions,function(err,data){
        if(err){
            console.log('error send email');
        }else{
            console.log('Email send!!')
        }
    })
    res.json({status:200})
})

app.put('/login',async(req,res)=>{
    const {email, password} = req.body
    var resObj    
    await User.findOne({email:email},(err,obj)=>{
        resObj = obj
    })
    console.log(resObj)
    if(resObj !== null){
        return res.json({status:resObj}) //user exist and send informartion
    }
    
    
    res.json({status:302}) // user no exist
})

app.put('/access',async(req,res)=>{
    const {_id} = req.body
    let resObj
    await User.findByIdAndUpdate(_id,{auth:"1"},(err,obj)=>{
        resObj = obj
    })
    if(resObj === null){
        return res.json({status:95})// user don't exist        
    }
    res.json({status:98}); //user auth access OK
})

app.put('/getUsersData',async(req,res)=>{
    const {status} = req.body
    res.json({status:await User.find()}); //Ok users
})

app.put('/deleteUsersData',async(req,res)=>{
    const {_id} = req.body
    let resObj
    await User.findByIdAndDelete(_id,(err,obj)=>{
        resObj = obj
    })
    if(resObj === null){
        return res.json({status:95})// user don't exist     
    }
    res.json({status:22}); //Ok user delete
})


app.put('/consult',async(req,res)=>{
    const {_id} = req.body
    let resObj
    await User.findOne({_id:_id},(err,obj)=>{
        resObj = obj
    })
    if(resObj === null){
        return res.json({status:95})// user don't exist        
    }
    res.json({status:resObj}); //user auth access OK
})

app.put('/changeData',async(req,res)=>{
    const {_id,name,lastName,email,phone,idEmployed} = req.body
    let resObj
    await User.findByIdAndUpdate(_id,{name:name,lastName:lastName,email:email,phone:phone,idEmployed:idEmployed},(err,obj)=>{
        resObj = obj
    })
    console.log(resObj)
    if(resObj === null){
        return res.json({status:95})// user don't exist        
    } 
    res.json({status:resObj}); //user Change data
})

app.put('/deleteData',async(req,res)=>{
    const {_id} = req.body
    let resObj
    await User.findByIdAndRemove(_id,(err,obj)=>{
        resObj = obj
    })
    console.log(resObj)
    if(resObj === null){
        return res.json({status:95})// user don't exist        
    } 
    res.json({status:50}); //user Delete data
})

app.put('/addNewTask',async(req,res)=>{
    const {payer,numOrder,concept,uds,process,finishDate,observations,createdId} = req.body
    let resObj
    await Tasks.findOne({numOrder:numOrder},(err,obj)=>{
        resObj = obj
    })

    if (resObj === null){
        const tasks = new Tasks({payer,numOrder,concept,uds,process,finishDate,observations,createdId})
        await tasks.save()
        return res.json({status:78}) //  task was saved
    }
    /*  */

    res.json({status:79}) //task already exist
})

app.put('/readTasks', async(req,res)=>{
    res.json(await Tasks.find())
})

app.put('/deleteTasks', async(req,res)=>{
    const {numOrder} = req.body
    console.log(numOrder)
    Tasks.findOneAndDelete({numOrder:numOrder},(err,obj)=>{
        console.log(obj)
    })
    res.json('ok')
})

app.put('/editTask',async(req,res)=>{
    const {_id,payer,numOrder,concept,uds,process,finishDate,observations,createdId} = req.body
    let resObj
    await Tasks.findByIdAndUpdate(_id,{payer:payer,numOrder:numOrder,concept:concept,uds:uds,process:process,finishDate:finishDate,observations:observations,createdId:createdId},(err,obj)=>{
        resObj = obj
    })
    if (resObj !== null){
        return res.json({status:71}) //  task was edited
    }
    
    res.json({status:73}) //task don't exist
})

app.put('/pushTask',async(req,res)=>{
    const {_id,process} = req.body
    let resObj
    await Tasks.findByIdAndUpdate(_id,{process:process},(err,obj)=>{
        resObj = obj
    })
    if (resObj !== null){
        return res.json({status:84}) //  process upload
    }
    res.json({status:73}) //task don't exist
})

app.put('/getNewTasks',async(req,res)=>{
    const {_id} = req.body
    let resObj
    await Tasks.findById(_id,(err,obj)=>{
        resObj = obj
        console.log(obj)
    })
    if (resObj !== null){
        console.log(resObj.process)
        return res.json({status:resObj.process}) //  process upload
    }
    res.json({status:73}) //task don't exist
})


app.put('/getHistory',async(req, res)=>{
    res.json(await History.find())
})

app.put('/stateChange',async(req,res)=>{
    const {_id} = req.body
    console.log(_id)
    let resObj
    await Tasks.findByIdAndRemove(_id,(err,obj)=>{
        resObj = obj
    })
    const {payer,numOrder,concept,uds,process,finishDate,observations,createdId} = resObj
    const history = new History({payer,numOrder,concept,uds,process,finishDate,observations,createdId})
    await history.save()
    res.json({status:38}) // pass satatus task to history
})

app.put('/deleteTaskHistory',async(req,res)=>{
    const {_id} = req.body
    let resObj
    await History.findByIdAndDelete(_id,(err,obj)=>{
        if(err) throw err
        resObj = obj
    })
    if(resObj === null){
        return res.json({status:75}) // task dont exist
    }
    res.json({status:37}) // obj delete 
})

module.exports = app