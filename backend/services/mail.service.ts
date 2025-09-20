import nodemailer from 'nodemailer'

export const userMail = async (email: string, fromEmail: string, template: string, subject: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.Mail_Email}`,
            pass: `${process.env.Mail_Secret}`
        }
    });

    const mailOption = {
        from: fromEmail,
        to: email,
        subject: subject,
        html: template
    }

    return await transporter.sendMail(mailOption)
}