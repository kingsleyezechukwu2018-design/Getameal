import sendMail from "..";

export async function sendOtpEmail(email: string, otp: string) {
  const subject = "Your OTP Code for Getameal";
  const html = `
    <p>Hi there,</p>
    <p>Your OTP code for Getameal is: <h4>${otp}</h4></p>
    <p>This code will expire in 60 seconds.</p>
    <p>If you did not request this code, please ignore this email.</p>
    <p>Best regards,<br/>The Getameal Team</p>
  `;

  await sendMail({ to: email, subject, html });
}
