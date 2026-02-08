"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = sendPushNotification;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
async function sendPushNotification({ token, title, body, }) {
    await firebase_admin_1.default.messaging().send({
        token,
        notification: {
            title,
            body,
        },
        data: {
            type: "NEW_MESSAGE",
        },
    });
}
//# sourceMappingURL=handler.js.map