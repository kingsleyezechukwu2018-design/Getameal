import { RouteError } from "configs/errors";
import createLogger, { ModuleType } from "utils/logger";
import { UserEntity } from "models/users/users.entity";

const logger = createLogger(ModuleType.Controller, "USERS");

// export async function completeAccountSetup({
//   email,
//   fullName,
//   address,
//   country,
// }: {
//   email: string;
//   fullName: string;
//   address: string;
//   country: string;
// }) {
//   logger.info("account setup completion request", {
//     fullName,
//     address,
//     country,
//     email,
//   });

//   let user = await UserEntity.findByParams({ email });
//   if (!user) {
//     const error = new RouteError("Account does not exist");
//     logger.info("account setup failed", { email, error });

//     throw error;
//   }

//   user = await UserEntity.updateUser(
//     { email },
//     {
//       fullName,
//       address,
//       country,
//       isComplete: true,
//     },
//   );

//   logger.info("account setup completed", { email });
//   const accessToken = generateAccessToken({ data: { userId: user.id, role: user.role } });

//   return { accessToken, user };
// }

//FE checks, if isComplete is false on signin/signup, redirect to the page to enter fullName, country, address, generate access token
