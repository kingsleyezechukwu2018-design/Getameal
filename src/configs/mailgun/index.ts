import appConfig from "configs";
import qs from "qs";
import { axiosApi } from "utils/helpers";

const { mailgunApiKey, mailgunDomain, appEmail, mailgunBaseUrl } = appConfig;

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
  await axiosApi(
    `${mailgunBaseUrl}/v3/${mailgunDomain}/messages`,
    "post",
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      auth: {
        username: "api",
        password: mailgunApiKey,
      },
    },
    qs.stringify({
      from,
      to,
      subject,
      html,
      "h:Reply-To": reply_to,
    }),
  );
}

export default sendMail;
