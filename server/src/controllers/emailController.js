import express from "express";
import { emailService} from "../services/emailService.js";


const emailController  = async(req,res)=>{
    try{
        const {from,to,subject,htmlContent} = req.body;

        const {from,to} = recipient;

        if(!recipient || !subject || !htmlContent){
            res.status(400).json({message:"Missing required fields"});
        }

        const result = await emailService({from,to,subject,htmlContent});
        res.status(200).json({message:"Email sent successfully",result});
    }catch(err){
        console.error("Error in sending email:", err);
        res.status(500).json({message:"Internal server error"});
    }
}

export default emailController;