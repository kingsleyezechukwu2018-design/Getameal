"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../../configs"));
const qs_1 = __importDefault(require("qs"));
const helpers_1 = require("../../utils/helpers");
const { mailgunApiKey, mailgunDomain, appEmail } = configs_1.default;
async function sendMail({ to, subject, html, from = appEmail, reply_to, }) {
    await (0, helpers_1.axiosApi)(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, "post", {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        auth: {
            username: "api",
            password: mailgunApiKey,
        },
    }, qs_1.default.stringify({
        from,
        to,
        subject,
        html,
        "h:Reply-To": reply_to,
    }));
}
exports.default = sendMail;
//# sourceMappingURL=index.js.map