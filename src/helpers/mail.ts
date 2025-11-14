import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({email, emailType, userId}: any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            });
        }

        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        });

        // Different URLs for different email types
        const verifyUrl = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;
        const resetUrl = `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;
        
        const url = emailType === "VERIFY" ? verifyUrl : resetUrl;
        const action = emailType === "VERIFY" ? "verify your email" : "reset your password";

        const mailOptions = {
            from: 'hitesh@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${url}">here</a> to ${action}
            or copy and paste the link below in your browser. <br> ${url}
            </p>`
        };

        const mailresponse = await transporter.sendMail(mailOptions);
        return mailresponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}