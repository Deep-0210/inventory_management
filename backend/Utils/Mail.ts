import nodemailer from 'nodemailer'

export const userMail = async (email: string, fromEmail: string, template: any, subject: string) => {
    const transporter = nodemailer.createTransport({
        // service: "gmail",
        host:"mail.mailtest.radixweb.net",
        port: 465,
        secure: true,
        auth: {
            user: `testdotnet@mailtest.radixweb.net`,
            pass: `Radix@web#8`
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