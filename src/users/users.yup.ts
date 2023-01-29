import * as Yup from "yup";

import { MessageCode } from "@interfaces";

import CreateUserInput from "./dto/create-user.input";

export default class UsersYup {
  validationUser(user: CreateUserInput) {
    const {
      USER_MAIL_INVALID,
      USER_MAIL_REQUIRED,
      USER_FIRSTNAME_REQUIRED,
      USER_LASTNAME_REQUIRED,
      USER_PASSWORD_REQUIRED,
    } = MessageCode;

    const userSchema = Yup.object({
      firstname: Yup.string().required(USER_FIRSTNAME_REQUIRED),
      lastname: Yup.string().required(USER_LASTNAME_REQUIRED),
      email: Yup.string().email(USER_MAIL_INVALID).required(USER_MAIL_REQUIRED),
      password: Yup.string().required(USER_PASSWORD_REQUIRED),
      avatar: Yup.string().nullable(),
    });

    return userSchema.validateSync(user);
  }

  validationUserEmail(email: string) {
    const { USER_MAIL_INVALID, USER_MAIL_REQUIRED } = MessageCode;

    const userEmailSchema = Yup.object({
      email: Yup.string().email(USER_MAIL_INVALID).required(USER_MAIL_REQUIRED),
    });

    return userEmailSchema.validateSync({ email }).email;
  }
}
