import { faker } from "@faker-js/faker";

import { ICategory, IUser } from "@interfaces";

export default class FakeUtils {
  public getUser(): Partial<IUser> {
    return {
      id: 0,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dni: "402-0000000-1",
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }

  public getCategory(): Partial<ICategory> {
    return {
      id: null,
      name: faker.company.name(),
      description: faker.lorem.paragraph(3),
    };
  }

  // public getPost(): Partial<IPost> {
  //   return {
  //     id: null,
  //     title: faker.company.name(),
  //     content: faker.lorem.paragraph(6),
  //     image: faker.image.url(),
  //   };
  // }
}
