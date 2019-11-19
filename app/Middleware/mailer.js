// var nodemailer = require('nodemailer');
// var transporter = nodemailer.createTransport({
        
//     service: 'gmail',
//     auth: {
//         user: 'info@hackmamba.io',
//         pass: 'hackmambainfo'           }
//     // auth: {
//     //     user: 'workhub18@gmail.com',
//     //     pass: 'Workhub2018'           }
//      });
//   //cloudinary password  Dentry2019..
//    exports.UserAdded = function(email,fullname, statusCode,callback){
//         var mailOptions = {
//             from: '"StylersInn"',
//             to: email,
//             subject: 'StylersInn Registration mail ',
//             html: `<center><h4></string>Hello ${fullname} thanks for signing up with StylersInn, Please verify your account by with this code ${statusCode}</h4>
//             </center>`
//         };
//         transporter.sendMail(mailOptions, callback); 
//         console.log('kk')
//    }

//    exports.StylerReg = function(email,fullname,callback){
//     var mailOptions = {
//         from: '"StylersInn"',
//         to: email,
//         subject: 'StylersInn Registration mail ',
//         html: `<center><h4></string>Hello ${fullname}</h4> thanks for signing up with StylersInn, Sorry your account will be on hold until our admin verififies your account . Thanks 
//         </center>`
//     };
//     transporter.sendMail(mailOptions, callback); 
//     console.log('kk')
// }

const sgMail = require("@sendgrid/mail");

exports.UserAdded = function(email, statusCode){
  return new Promise((resolve, reject) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "info@hackmamba.io",
      subject: "StylersInn client Registration mail",
      text: "and easy to do anywhere, even with Node.js",
      html: `Hi , thanks for signing up with StylersInn, Please verify your account with this code ${statusCode}`
    };
    sgMail.send(msg,false ).then(sent =>{
      if(sent){
        resolve({success:true , message:'mail sent '})
      }else{
        resolve({success: false , message:'mail not sent '})
      }
    }).catch(err =>{
      reject(err)
    })
  });
};

exports.StylerReg = function(email){
    return new Promise((resolve, reject) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: "info@hackmamba.io",
        subject: "StylersInn styler Registration mail",
        text: "and easy to do anywhere, even with Node.js",
        html: `Hello  thanks for signing up with StylersInn, Sorry your account will be on hold until our admin verifiies your account . Thanks `
      };
      sgMail.send(msg,false ).then(sent =>{
        if(sent){
          resolve({success:true , message:'mail sent '})
        }else{
          resolve({success: false , message:'mail not sent '})
        }
      }).catch(err =>{
        reject(err)
      })
    });
  };


  exports.Help = function(email , name, message){
    return new Promise((resolve, reject) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: "buka4chocksy@gmail.com",
        from: email,
        subject: "StylersInn Help message ",
        text: "and easy to do anywhere, even with Node.js",
        html: `Hello i am ${name}, ${message} `
      };
      sgMail.send(msg,false ).then(sent =>{
        if(sent){
          resolve({success:true , message:'mail sent '})
        }else{
          resolve({success: false , message:'mail not sent '})
        }
      }).catch(err =>{
        reject(err)
      })
    });
  };
  
