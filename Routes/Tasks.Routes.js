'use strict'
//models
const User = require('../Models/Users');
const Tasks = require('../Models/Tasks');
const History = require('../Models/History');
const Notifications = require('../Models/Notifications');
const Tokens = require('../Models/Tokens');
const fcm = require('fcm-notification');
const FCM = new fcm('./frontpanelnotificatons-firebase-adminsdk-2k5zf-dfdccd5abf.json');
var TokensUsers = [];

const URIServer = '138.68.81.244' //181.54.182.7

const express = require('express'),
      app = express.Router()
const nodemailer = require('nodemailer');

var message =(title,body)=> {
    return {
    notification:{
      title : title,
      body : body
    }}
  };
  

async function writeTokens(){
    const TokensGetting= await Tokens.find()
        TokensUsers = []
        TokensGetting.map((value)=>{
            if(value.TokenDevice === null){
                return true
            }
            if(value.TokenDevice !== ''){
              TokensUsers.push(value.TokenDevice)
            }
       });
       
}

writeTokens()


app.get('/',(req,res)=>{
    res.json({response:'frontpanelapp'})
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
    var resObj
    const user = new User({name, lastName ,roll, email, password})
    await user.save()
    await User.findOne({email:email},(err,obj)=>{
        resObj = obj
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user:'frontpanelappmanager@gmail.com',
                pass:'jose042199'
            }
        });
        
        let mailOptions = {
            from: 'frontpanelappmanager@gmail.com',
            to: 'newappordercontrol@gmail.com',
            subject: name+' esta pidiendo autorizacion con el correo '+ email +' para acceder a front panel app',
            text: name+' '+lastName+' Esta pidiendo a autorizacion, se la puedes conceder en este link'+'\nhttp://'+URIServer+':8080/accessFrontpanelApp/'+obj._id
        }
        transporter.sendMail(mailOptions,function(err,data){
            if(err){
                console.log(err);
            }else{
                console.log('Email send!!')
            }
        })
    })
    
    res.json({status:200})
})

app.put('/getAuth',async(req,res)=>{
    const {email} = req.body
    var resObj    
    await User.findOne({email:email},(err,obj)=>{
        resObj = obj
    })
    if(resObj === null){
        return res.json({status:100})   
    }
    
    
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user:'frontpanelappmanager@gmail.com',
            pass:'jose042199'
        }
    });
    
    let mailOptions = {
        from: 'frontpanelappmanager@gmail.com',
        to: 'newappordercontrol@gmail.com',
        subject: name+' esta pidiendo autorizacion con el correo '+ email +' para acceder a front panel app',
        text: name+' '+lastName+' Esta pidiendo a autorizacion, se la puedes conceder en este link'+'\nhttp://'+URIServer+':8080/accessFrontpanelApp/'+resObj._id
    }
    transporter.sendMail(mailOptions,function(err,data){
        if(err){
            console.log(err);
        }else{
           return res.json({status:200})
        }
    })
    
})

app.put('/sendrecoveryPass',async(req,res)=>{
    const {email} = req.body
    var resObj    
    await User.findOne({email:email},(err,obj)=>{
        resObj = obj
        if(obj !== null){
        try{
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                auth: {
                    user:'frontpanelappmanager@gmail.com',
                    pass:'jose042199'
                }
            });
            
            let mailOptions = {
                from: 'frontpanelappmanager@gmail.com',
                to: email,
                subject: 'Recupera tu contraseña de frontPanelApp',
                text: obj.name+' Puedes cambiar tu contraseña en este link'+'\nhttp://'+URIServer+':8080/recoveryPassword/'+resObj._id
            }
            transporter.sendMail(mailOptions,function(err,data){
                if(err){
                    console.log(err);
                }
            })
        }catch(e){
            if(e) throw e
        }
    }
    })
    if(resObj === null){
        return res.json({status:100})   
    }
    res.json({status:200})
})

app.put('/recoveryPass',async(req,res)=>{
    const {_id,password} = req.body
    await User.findByIdAndUpdate(_id,{password:password},(err,obj)=>{
        if(err) throw err
    })
    res.json({status:200})
})

app.put('/login',async(req,res)=>{
    const {email, password} = req.body
    var resObj    
    await User.findOne({email:email},(err,obj)=>{
        resObj = obj
    })
    //console.log(resObj)
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
        try{
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                auth: {
                    user:'frontpanelappmanager@gmail.com',
                    pass:'jose042199'
                }
            });
            
            let mailOptions = {
                from: 'frontpanelappmanager@gmail.com',
                to: obj.email,
                subject: 'Has sido aceptado en frontPanelApp',
                text: obj.name+' Ya puedes acceder a la app de front panel'
            }
            transporter.sendMail(mailOptions,function(err,data){
                if(err){
                    console.log(err);
                }
            })
        }catch(e){
            if(e) throw e
        }
    })
    if(resObj === null){
        return res.json({status:95})// user don't exist        
    }
    res.json({status:98}); //user auth access OK
})

app.put('/adviceSend',async(req,res)=>{
    const {advice} = req.body
    try{
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                auth: {
                    user:'frontpanelappmanager@gmail.com',
                    pass:'jose042199'
                }
            });
            
            let mailOptions = {
                from: 'frontpanelappmanager@gmail.com',
                to: 'newappordercontrol@gmail.com',
                subject: 'Sugerencia',
                text: advice
            }
            transporter.sendMail(mailOptions,function(err,data){
                if(err){
                    console.log(err);
                }
            })
        }catch(e){
            if(e) throw e
        }
    
    res.json({status:200}); //user auth access OK
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

app.put('/addToken',async(req,res)=>{
    
    const {_id, TokenDevice} = req.body
    var resObj
    const tokens = new Tokens({TokenDevice})

    await Tokens.findOne({TokenDevice:TokenDevice},(err,obj)=>{
        resObj = obj
    })
    if(resObj === null){
        await tokens.save()
        const TokensGetting= await Tokens.find()
        TokensUsers = []
        TokensGetting.map((value)=>{
            if(value.TokenDevice === null){
                return true
            }
            if(value.TokenDevice !== ''){
              TokensUsers.push(value.TokenDevice)
            }
        })
        return res.json({status:200})
    } 
    res.json({status:400})
      
    
})

app.put('/deleteToken',async(req,res)=>{
    const {TokenId} = req.body
    var resObj
    await Tokens.findOneAndDelete({TokenDevice:TokenId},(err,obj)=>{
        resObj = obj
    })
    if(resObj === null){
        
        return res.json({status:400})
    }

    const TokensGetting= await Tokens.find()
        TokensUsers = []
        TokensGetting.map((value)=>{
            if(value.TokenDevice === null){
                return true
            }
            if(value.TokenDevice !== ''){
              TokensUsers.push(value.TokenDevice)
            }
        })
    res.json({status:200})
      
    
})

app.put('/changeData',async(req,res)=>{
    const {_id,name,lastName,email,phone,idEmployed} = req.body
    let resObj
    await User.findByIdAndUpdate(_id,{name:name,lastName:lastName,email:email,phone:phone,idEmployed:idEmployed},(err,obj)=>{
        resObj = obj
    })
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
    if(resObj === null){
        return res.json({status:95})// user don't exist        
    } 
    res.json({status:50}); //user Delete data
})

app.put('/addNewTask',async(req,res)=>{
    const {payer,numOrder,concept,uds,process,finishDate,observations,createdId,createDate} = req.body
    let resObj
    let resObjHistory
    await Tasks.findOne({numOrder:numOrder},(err,obj)=>{
        resObj = obj
        console.log('Task ',resObj)
    })


    await History.findOne({numOrder:numOrder},(err,obj)=>{
        resObjHistory = obj
        console.log('Task History',resObjHistory)
    })

    if (resObj === null && resObjHistory === null){
        const tasks = new Tasks({payer,numOrder,concept,uds,process,createDate,finishDate,observations,createdId})
        await tasks.save()
        FCM.sendToMultipleToken(message('Orden Creada','La orden ' + numOrder + ' ha sido creada'), TokensUsers, function(err, response) {
            if(err) throw err
         
        })
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
    Tasks.findOneAndDelete({numOrder:numOrder},(err,obj)=>{
        if(err) throw err
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
        FCM.sendToMultipleToken(message('Orden Editada','La orden ' + numOrder + ' ha sido editada'), TokensUsers, function(err, response) {
            if(err)throw err
        })
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
    })
    if (resObj !== null){
        return res.json({status:resObj.process,concpet:resObj.concept,observations:resObj.observations,date:resObj.finishDate}) //  process upload
    }
    res.json({status:73}) //task don't exist
})

app.put('/getdataTasks',async(req,res)=>{
    const {_id} = req.body
    let resObj
    await Tasks.findById(_id,(err,obj)=>{
        resObj = obj
    })
    if (resObj !== null){
        return res.json(resObj) //  process upload
    }
    res.json({status:73}) //task don't exist
})

app.put('/getHistory',async(req, res)=>{
    const {lenght} = req.body;
    const data = await History.find().sort({_id:-1}).limit(lenght);
    const len = await (await History.find()).length;
    res.json({status:data,len:len})
})

app.put('/stateChange',async(req,res)=>{
    const {_id,DepartedDate} = req.body
    let resObj
    await Tasks.findByIdAndRemove(_id,(err,obj)=>{
        resObj = obj
    })
    const {payer,numOrder,concept,uds,process,createDate,finishDate,observations,createdId} = resObj
    const history = new History({payer,numOrder,concept,uds,process,createDate,finishDate,DepartedDate,observations,createdId})
    await history.save()
    res.json({status:38}) // pass satatus task to history
})

app.put('/deleteTaskHistory',async(req,res)=>{
    const {_id} = req.body
    //status list 1: create, 2: modify , 3: delete, 4: Complete
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

app.put('/readNotificationUser',async(req,res)=>{
    const {_id} = req.body
    var sizeRead = 0
    await User.findById(_id,(err,obj)=>{
        if(err) throw err
       //console.log(obj.nRead);
       if(obj.nRead !== undefined){
           sizeRead = parseInt(obj.nRead)
       }
    });

    res.json({sizeUser:sizeRead})
})

app.put('/writeNotificationUser',async(req,res)=>{
    const {_id,nRead} = req.body
    await User.findByIdAndUpdate(_id,{nRead:nRead})
    //console.log('update')
    res.json({status:158})
})

app.put('/lenNotifications',async(req,res)=>{
    const data = (await Notifications.find()).length
    res.json({size:data})
});

app.put('/NotificationsRead',async(req,res)=>{
    
    res.json(await Notifications.find().sort({_id:-1}).limit(10)) // obj read
})

app.put('/NotificationsWrite',async(req,res)=>{
    const {numOrder,status} = req.body
    const notifications = new Notifications({numOrder,status})
    await notifications.save()
    if(status === 4){
    FCM.sendToMultipleToken(message('Orden Completada','La orden ' + numOrder + ' ha sido completada'), TokensUsers, function(err, response) {
        if(err)throw err
    })
    }
    res.json({status:200}) // obj write
})




module.exports = app