import { faker } from "@faker-js/faker";

import { ICategory, IUser } from "../interfaces";

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

  public getCategory(): ICategory {
    return {
      _id: null,
      name: faker.company.name(),
      description: faker.lorem.paragraph(3),
    };
  }
}
