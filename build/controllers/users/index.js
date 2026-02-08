"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importStar(require("../../utils/logger"));
const logger = (0, logger_1.default)(logger_1.ModuleType.Controller, "USERS");
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
//# sourceMappingURL=index.js.map