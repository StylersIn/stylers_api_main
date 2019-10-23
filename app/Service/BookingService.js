var model = require('../Model/booking');
var BaseRepo = require('../Repository/BaseRepository');
var styler = require('../Model/stylers');
var service =  require('../Model/services');
var bookingFunction = require('../Middleware/bookingAlgo')
var stylersRepo = require('../Repository/BaseRepository');
var BookingRepo = new BaseRepo(model);
exports.FindStyler = function (option , pagenumber = 1, pagesize = 20) {
    return new Promise((resolve, reject) => {
        service.find({ name: { $regex: option, $options: 'i' }})
        .exec((err, found) => {
            if (err) { reject(err); }
            if (found == null || Object.keys(found).length === 0) {
                resolve({ success: false, data: {}, message: "We could not find what you are looking for." })
            } else {
                var ids = found.map(docs =>{return docs._id});
                styler.find({"services.serviceId":{$in:ids}})
                .skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
                .populate({ path: "services.serviceId", model: "services", select: { _id: 0, __v: 0 } })
                .exec((err, stylers)=>{
                    if(err)reject(err);
                    if(stylers){
                        resolve({success:true , message:'stylers found', data:stylers})
                    }else{
                        resolve({success:false , message:'Unable to find what you searched for !!'})
                    }
                });
            }
        })
    })
}



exports.BookService = (options)=>{
    return new Promise((resolve , reject )=>{
        bookingFunction.calculateAmount(options.stylerId , options.serviceId ,options.numberOfAduls, options.numberOfChildren, (result=>{
        var details = {
        userId:options.userId,
        stylerId:options.stylerId,
        serviceId:options.serviceId,
        scheduledDate:Date.now(),
        numberOfAdults:options.numberOfAduls,
        numberOfChildren:options.numberOfChildren,
        location:options.location,
        TotalAmount:result,
        CreatedAt:new Date()
      }
        BookingRepo.add(details).then(created =>{
            if(created){
                resolve({success:true , message:'Service booked successfully'})
            }else{
                resolve({success:false , message:'Could not complete your booking process'})
            }
        }).catch(err =>{
            reject(err);
        })
        }))
        
    })
}

exports.getUserBookings = (  pagenumber = 1, pagesize = 20 , userId)=>{
    return new Promise((resolve , reject)=>{
        model.find({userId:userId}).skip((parseInt(pagenumber - 1) * parseInt(pagesize))).limit(parseInt(pagesize))
        .populate({ path: "serviceId", model: "services", select: { _id: 0, __v: 0 } })
        .populate({ path: "userId", model: "user", select: { _id: 0, __v: 0 } })
        .populate({ path: "stylerId", model: "stylers", select: { _id: 0, __v: 0 } })
        .exec((err, data)=>{
            if(err)reject(err);
            if(data){
                resolve({success:true , message:'Bookings found', data:data})
            }else{
                resolve({success:false , message:'Unable to find what you searched for !!'})
            }
        });
    })
}

