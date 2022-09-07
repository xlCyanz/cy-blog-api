import { Faker } from "@faker-js/faker";
import { IUser } from "src/interfaces";
import { Types } from "mongoose";

export default class FakeUtils {
  constructor(private readonly faker: Faker) {}

  public getUser(): IUser {
    return {
      _id: new Types.ObjectId(this.faker.datatype.uuid()),
      firstname: this.faker.name.firstName(),
      lastname: this.faker.name.lastName(),
      avatar: this.faker.image.avatar(),
      email: this.faker.internet.email(),
      password: this.faker.internet.password(),
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
