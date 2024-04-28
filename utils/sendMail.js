import { createTransport } from "nodemailer";
export const sendMail = async (to, subject, text) => {
  const transPorter = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c3640fcb686ad0",
      pass: "68214cbc861815",
    },
  });
  transPorter.sendMail({
    to,
    subject,
    text,
    from: "d.jrajsingh81@gmail.com",
  });
};
