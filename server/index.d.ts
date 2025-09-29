import { IUser } from "../server/src/models/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}