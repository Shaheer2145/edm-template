import transporter from "../config/smtp.js";
import nodemailer from "nodemailer";

const emailService = async ({from,to,subject,htmlContent}) => {
    try {
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: htmlContent,
        }

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error in sending mail:", error);
        throw error;
    }
}

export default emailService;