import { faker } from "@faker-js/faker";

import { ICategory, IPost, IUser } from "@interfaces";

export default class FakeUtils {
  public getUser(): Partial<IUser> {
    return {
      id: 0,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    };
  }

  public getAdmin(): Partial<IUser> {
    return {
      ...this.getUser(),
      role: "admin",
    };
  }

  public getCategory(): Partial<ICategory> {
    return {
      id: null,
      name: faker.company.name(),
      description: faker.lorem.paragraph(3),
    };
  }

  public getPost(): Partial<IPost> {
    return {
      id: null,
      title: faker.company.name(),
      body: faker.lorem.paragraph(6),
      image: faker.image.animals(),
    };
  }
}
