import app,{
  credential,
  ServiceAccount,
} from "firebase-admin";
import serviceAccount from "../../../firebase-admin.json";

app.initializeApp({
  credential: credential.cert(serviceAccount as ServiceAccount),
});

export default app;
