if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config();
}


const express= require('express')
const app = express()
const path = require('path')
const mongoose= require('mongoose')
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Db Connected'))
.catch((e)=>console.log(e))

app.use(express.urlencoded({extended:true}))

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')))






const nodemailer= require('nodemailer')
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.MY_USERNAME,
        pass:process.env.MY_PASSWORD
    }

}); 






const entrySchema = new mongoose.Schema({
    name : {
        type:String,
        trim:true,
        required:true,
    },
    phone:{
        type:Number,
      
        required:true,
    },
    email:{
   type: String,
//    required:true,
    }
,
    time:{
 type:String,   
    },
    day:{
        type:String,
    }


});
const Entry=mongoose.model('Entry',entrySchema);


const day=new Date().toDateString();
   const p= new Date().toLocaleString();
   const time =new Date().toLocaleString().substring(p.length-11);
let em="";
let ag="";

   app.post('/entry',(req,res)=>{

   const items=[       
   {...req.body,
    day,
    time}
   ];
ag=req.body.name;
  em= req.body.email;

  const entry= Entry.insertMany(items)
   .then(()=>{
       console.log('inserted')
    })
    .catch((e)=>{
        console.log(e);
    })

    
const options={
    from:process.env.MY_USERNAME,
    to:em,
    subject:"Visitor app Login",
    text:`Hey ${ag} you logged in Visitor App @ ${time} on ${day}  from ${em}`
}

transporter.sendMail(options,(err,info)=>{
    if(err)
    {
        console.log(err);
        return;
    }
    else{
        console.log('SEnt' + info.response);
    }
})

   
   res.render('leave');
});


app.get('/leave',(req,res)=>
{

    res.render('leave');
})




app.post('/leave',(req,res)=>{

    const d=new Date().toDateString();
   const p= new Date().toLocaleString();
   const t =new Date().toLocaleString().substring(p.length-11);
    const options={
        from:process.env.MY_USERNAME,
        to:em,
        subject:"Visitor app Log-out",
        text:`Hey ${ag} you have been successfully logged OUT Visitor App @ ${t} on ${d}  from ${em}`
    }

    transporter.sendMail(options,(err,info)=>{
        if(err)
        {
            console.log(err);
            return;
        }
        else{
            console.log('SEnt' + info.response);
        }
    })
    

    res.send('<h1>Successfully Logged Out</h1>');
    });



app.get('/entry',async(req,res)=>{
    
 await res.render('entry',{day,time});

});




app.get('/',(req,res)=>{
res.render('index');
})

app.listen(process.env.PORT|| 3000,()=>{
    console.log('Server running at port 3000');
})