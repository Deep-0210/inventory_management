import nodemailer from 'nodemailer'

export const userMail = async (email: string, template: any) => {
    const transporter = nodemailer.createTransport({
        service:"gmail",
        port:587,
        secure:false,
        auth: {
            user: `${process.env.Mail_Email}`,
            pass: `${process.env.Mail_Secret}`
        }
    });

    const mailOption = {
        from: `${process.env.Mail_Email}`,
        to: email,
        subject: `${process.env.Mail_Subject}`,
        html: template
    }

    return await transporter.sendMail(mailOption)
}