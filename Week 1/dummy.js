const express=require("express");
const app=express();
app.use(express.json())
app.get('/',(req,res)=>
{
    res.send("hello");
});
app.post('/',(req,res)=>
{
const boddy=req.body;
console.log(boddy);
});
app.listen(3000);