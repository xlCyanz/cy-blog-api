import { faker } from "@faker-js/faker";

import { IUser } from "../interfaces";

export default class FakeUtils {
  public getUser(): IUser {
    return {
      _id: null,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    };
  }

  public getAdmin(): IUser {
    return {
      ...this.getUser(),
      role: "admin",
    };
  }
}
