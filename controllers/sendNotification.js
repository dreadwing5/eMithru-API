const cron = require("node-cron");
const nodemailer = require("nodemailer");

const sendNotification = async (to, subject, body) => {
  const mailOptions = {
    from: "your_email_address",
    to: to,
    subject: subject,
    text: body,
  };

  const Student = await Student.find().json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your_email_address",
      pass: "your_email_password",
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

const checkMentalHealthStatus = () => {
  const now = new Date();

  // Check if it's the first day of the month
  if (now.getDate() === 1) {
    // Code to check the mental health status of the students

    const mentorEmail = "mentor_email_address";
    const subject = "Mental health status update";
    const body = "The mental health status of the students is: ...";

    sendNotification(mentorEmail, subject, body);
  }
};

cron.schedule("0 0 1 * *", () => {
  checkMentalHealthStatus();
});
