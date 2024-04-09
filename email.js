const { Resend } = require("resend");
const resend = new Resend("re_QT2XF1xm_5V2J7f96NMHdvDjCJQ1mbsuk");

const sendmail = async (email, text) => {
    const { data, error } = await resend.emails.send({
        from: "testing <onboarding@resend.dev>",
        to: [email],
        subject: "hello world",
        text: text,
        html: "<strong>it works!</strong>",
    });

    if (error) {
        console.log(error.message)
        return;
    }
    return data
};


module.exports = {
    sendmail
}