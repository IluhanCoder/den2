import mongoose from "mongoose";
import UserError from "./user-errors.js";
import UserSchema from "./user-schema.js";
import md5 from "md5";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import IUser from "./IUser.js";

export default class UserService {
  UserModel;

  constructor(dbConnection: mongoose.Connection) {
    dbConnection.model("User", UserSchema);
    this.UserModel = dbConnection.models.User;
  }

  async login(login: string, password: string, email: string) {
    try {
      const user: IUser = await this.UserModel.findOne({ login: md5(login) });
      if (user === null) {
        try {
          await this.UserModel.create({
            login: md5(login),
            password: md5(password),
            email,
          });
          await this.sendEmail(email);
          return;
        } catch (error) {
          throw error;
        }
      }
      if (user.password !== md5(password)) throw UserError.wrongPassword();
      if (user.confirmed === false) throw UserError.unConfirmed();
      else return user;
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(userEmail: string) {
    try {
      const GMAIL_ADRESS = process.env.GMAIL;
      const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_ADRESS,
          pass: GMAIL_PASSWORD,
        },
      });

      const EMAIL_SECRET = process.env.EMAIL_SECRET;
      const CLIENT_URL = process.env.CLIENT_URL;
      const emailToken = await jwt.sign(
        {
          email: userEmail,
        },
        EMAIL_SECRET
      );
      const url = `${CLIENT_URL}/email/${emailToken}`;

      const info = await transporter.sendMail({
        from: GMAIL_ADRESS,
        to: userEmail,
        subject: "Верифікація користувача",
        html: `Будь-ласка, перейдіть за посиланням для підтвердження вашого email: <a href="${url}">${url}</a>`,
      });

      console.log("send email");
    } catch (error) {
      throw error;
    }
  }

  async submitEmail(data) {
    try {
      const EMAIL_SECRET = process.env.EMAIL_SECRET;
      const decoded = await jwt.verify(data, EMAIL_SECRET);
      return await this.UserModel.findOneAndUpdate(
        { email: decoded },
        { confirmed: true }
      );
    } catch (error) {
      throw error;
    }
  }
}
