import * as yup from "yup";

import { MessageCode } from "../../interfaces";
import { CreateUserInput } from "../dto/create-user.input";

const validationUser = (user: CreateUserInput) => {
  const {
    USER_MAIL_INVALID,
    USER_MAIL_REQUIRED,
    USER_FIRSTNAME_REQUIRED,
    USER_LASTNAME_REQUIRED,
    USER_PASSWORD_REQUIRED,
  } = MessageCode;

  const userSchema = yup.object({
    firstname: yup.string().required(USER_FIRSTNAME_REQUIRED),
    lastname: yup.string().required(USER_LASTNAME_REQUIRED),
    email: yup.string().email(USER_MAIL_INVALID).required(USER_MAIL_REQUIRED),
    password: yup.string().required(USER_PASSWORD_REQUIRED),
    avatar: yup.string().nullable(),
  });

  return userSchema.validateSync(user);
};

export default validationUser;
