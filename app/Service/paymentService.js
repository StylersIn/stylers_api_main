var model = require('../Model/payment');

exports.CreatePayment = (options)=>{
    return new Promise((resolve , reject)=>{
        model.create(options).then(created =>{
            if(created){
                resolve({success:true , message: 'Payment was made successfully !!!'})
            }else{
                resolve({success: false , message: 'Sorry payment was not made !!'})
            }
        }).catch(err =>{
            reject(err);
        })
    })
}

exports.getStylerTotalAmount = (data)=>{
    return new Promise((resolve , reject)=>{
        model.find({stylerId: data}).then(found =>{
            if (found){
                var a =  found.map(b => b.amount)
                let sumTotal = a.reduce((c, d)=> c+ d ,0) 
                resolve({success:true , message:'total amount' , data:sumTotal})
            }else{
                resolve({success: false  , message:' Styler sum total not found !!!'})
            }

        }).catch(err =>{
            reject(err);
        })
    })
}