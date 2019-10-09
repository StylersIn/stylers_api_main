var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
        
    service: 'gmail',
    auth: {
        user: 'info@hackmamba.io',
        pass: 'hackmambainfo'           }
    // auth: {
    //     user: 'workhub18@gmail.com',
    //     pass: 'Workhub2018'           }
     });
  //cloudinary password  Dentry2019..
   exports.UserAdded = function(email,fullname, statusCode,callback){
        var mailOptions = {
            from: '"StylersInn"',
            to: email,
            subject: 'StylersInn Registration mail ',
            html: `<center><h4></string>Hello ${fullname} thanks for signing up with StylersInn, Please verify your account by with this code ${statusCode}</h4>
            </center>`
        };
        transporter.sendMail(mailOptions, callback); 
        console.log('kk')
   }

   exports.StylerReg = function(email,fullname,callback){
    var mailOptions = {
        from: '"StylersInn"',
        to: email,
        subject: 'StylersInn Registration mail ',
        html: `<center><h4></string>Hello ${fullname}</h4> thanks for signing up with StylersInn, Sorry your account will be on hold until our admin verififies your account . Thanks 
        </center>`
    };
    transporter.sendMail(mailOptions, callback); 
    console.log('kk')
}