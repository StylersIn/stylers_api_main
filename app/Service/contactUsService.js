var model = require('../Model/contactUs');
var user = require('../Model/user');
var mailer = require('../Middleware/mailer');
exports.createHelp = (data)=>{
    return new Promise((resolve , reject)=>{
        user.findById({_id:data.userId}).then(found =>{
            if(found){
                mailer.Help(data.email,data.name , data.message).then(sent =>{
                    if(!sent){
                        resolve({success:false , message:'you help message was not sent'})    
                    }else{
                         resolve({success:true , message:'you help message was sent'})
                    }
                })
            }else{
                resolve({success:false , message:'you help message was not sent'})  
            }
        }).catch(err =>{
            reject(err)
        });
    })
}