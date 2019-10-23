var BookingService = require('../Service/BookingService');
module.exports = function ServicesController(){

    this.SearchServices = (req,res)=>{
        console.log('kkkk')
       var option = req.query.service;
       console.log(option)
       BookingService.FindStyler(option).then((data)=>{
           res.json({data});
       }).catch((err)=>{
           res.status(500).send(err);
       });
   }
   
   this.CreateBooking = (req, res)=>{
       var Options = {
        userId:req.auth.Id,
        stylerId:req.body.styler,
        serviceId:req.body.service,
        scheduledDate:Date.now(),
        numberOfAduls:req.body.adult,
        numberOfChildren:req.body.child,
        location:req.body.locations,
       }
       BookingService.BookService(Options).then((data)=>{
        res.json({data});
    }).catch((err)=>{
        res.status(500).send(err);
    });
   }

   
   this.UserBookings = function(req, res, next){
    BookingService.getUserBookings( req.params.pagenumber, req.params.pagesize,req.auth.Id)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err));
}
   

}