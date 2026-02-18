import appConfig from "configs";
import admin from "firebase-admin";
import fs from "fs";

const { isDev } = appConfig;

const serviceAccount = isDev
  ? JSON.parse(fs.readFileSync("firebase-adminsdk.json", "utf8"))
  : JSON.parse(
      fs.readFileSync(
        "/etc/secrets/getamealapp-11af2-firebase-adminsdk-fbsvc-3e2413e8b0.json",
        "utf8",
      ),
    );

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
