import express from 'express';
const app = express();


const router = express.Router();


router.post('/send-email',(req,res)=>{
    console.log("Send-email");

})
