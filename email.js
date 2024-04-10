const { Resend } = require("resend");
const resend = new Resend(process.env.EMAIL_KEY);

const sendmail = async (email, text) => {
    const { data, error } = await resend.emails.send({
        from: "testing <onboarding@resend.dev>",
        // Can only send email to this only!!
        to: ['vaibhavwateam@gmail.com'],
        subject: "hello world",
        html: `<strong>${text}</strong>`,
    });

    if (error) {
        console.log(error.message)
        return;
    }
    console.log(data);
    return data
};


module.exports = {
    sendmail
}