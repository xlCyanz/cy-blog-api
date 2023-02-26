import { faker } from "@faker-js/faker";

import { ICategory, IPost, IUser } from "@interfaces";

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

  public getPost(): Partial<IPost> {
    return {
      _id: null,
      title: faker.company.name(),
      content: faker.lorem.paragraph(6),
      image: faker.image.animals(),
    };
  }
}
