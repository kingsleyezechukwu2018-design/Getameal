import appConfig from "configs";
import qs from "qs";
import { axiosApi } from "utils/helpers";
import axios from "axios";

const { mailgunApiKey, mailgunDomain, appEmail } = appConfig;

async function sendMail({
  to,
  subject,
  html,
  from = appEmail,
  reply_to,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  reply_to?: any;
}) {
  // await axiosApi(
  //   `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
  //   "post",
  //   {
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     auth: {
  //       username: "api",
  //       password: mailgunApiKey,
  //     },
  //   },
  //   qs.stringify({
  //     from,
  //     to,
  //     subject,
  //     html,
  //     "h:Reply-To": reply_to,
  //   }),
  // );
}

export default sendMail;

export async function sendTestEmail() {
  try {
    await axios.post(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      qs.stringify({
        from: "Mailgun Sandbox <postmaster@sandbox55ae9ef5d16d462a9ab9b601ecb76d81.mailgun.org>",
        to: "mustaphaamidatoyindamola@gmail.com",
        subject: "Testing Email delivery",
        text: "This email was sent from getameal  app",
      }),
      {
        auth: {
          username: "api",
          password: mailgunApiKey,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
}
