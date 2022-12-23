import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";

import FakeUtils from "../../src/utils/fake-utils";
import Utilities from "../../src/utils/utilities";
import { AppModule } from "../../src/app.module";
import { IUser, MessageCode } from "../../src/interfaces";
import {
  CREATE_USER,
  REMOVE_USER,
  UPDATE_USER,
  GET_USER_BY_ID,
  GET_USER_BY_NAME,
  GET_USER_BY_EMAIL,
} from "./users.graphql";

describe("Users (e2e)", () => {
  let app: INestApplication;
  const path = "/graphql";

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => await app.close());

  const faker = new FakeUtils();

  const user = (() =>
    Utilities.omitFromObjectProperties<IUser>(faker.getUser(), [
      "_id",
      "role",
    ]))();

  const updatedUser: IUser = {
    _id: null,
    ...(Utilities.omitFromObjectProperties<IUser>(faker.getUser(), [
      "password",
      "comparePassword",
      "email",
      "role",
    ]) as unknown as IUser),
  };

  it("No query test should have typename", async () => {
    expect(CREATE_USER.includes("typename")).toBe(false);
    expect(REMOVE_USER.includes("typename")).toBe(false);
    expect(UPDATE_USER.includes("typename")).toBe(false);
    expect(GET_USER_BY_ID.includes("typename")).toBe(false);
    expect(GET_USER_BY_NAME.includes("typename")).toBe(false);
    expect(GET_USER_BY_EMAIL.includes("typename")).toBe(false);

    // expect(LOGIN_USER.includes("typename")).toBe(false);
    // expect(LOGIN_REGISTER.includes("typename")).toBe(false);
  });

  it("Create a user", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_USER,
        variables: {
          input: {
            ...user,
          },
        },
      })
      .expect(200)
      .then((res) => {
        const { createUser } = res.body.data;

        expect(createUser.statusCode).toBe(HttpStatus.CREATED);
        expect(createUser.messageCode).toBe(MessageCode.USER_CREATED);
        expect(createUser.data).toBeDefined();

        expect(createUser.data._id).toBeDefined();
        expect(createUser.data.firstname).toBe(user.firstname);
        expect(createUser.data.lastname).toBe(user.lastname);
        expect(createUser.data.password).not.toBe(user.password);
        expect(createUser.data.email).toBe(user.email);
        expect(createUser.data.role).toBeDefined();
        expect(createUser.data.role).toBe("user");
        expect(createUser.data.avatar).toBe(user.avatar);
        expect(createUser.data.createdAt).toBeDefined();

        updatedUser._id = createUser.data._id;
      }));

  it("Create a duplicate user", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_USER,
        variables: {
          input: {
            ...user,
          },
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_ALREADY_EXISTS);
        expect(res.body.data).toBeNull();
      }));

  it("Get a user by id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_ID,
        variables: {
          id: updatedUser._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { user: userById } = res.body.data;

        expect(userById.statusCode).toBe(HttpStatus.FOUND);
        expect(userById.messageCode).toBe(MessageCode.USER_FOUND);
        expect(userById.data).toBeDefined();

        expect(userById.data._id).toBeDefined();
        expect(userById.data.firstname).toBe(user.firstname);
        expect(userById.data.lastname).toBe(user.lastname);
        expect(userById.data.password).not.toBe(user.password);
        expect(userById.data.email).toBe(user.email);
        expect(userById.data.role).toBeDefined();
        expect(userById.data.role).toBe("user");
      }));

  it("Get a user by empty id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_ID,
        variables: {
          id: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_ID_REQUIRED);
        expect(res.body.data).toBeNull();
      }));

  it("Get a user by invalid id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_ID,
        variables: {
          id: `${updatedUser._id}${updatedUser._id}`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_ID_INVALID);
        expect(res.body.data).toBeNull();
      }));

  it("Get a user by email", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_EMAIL,
        variables: {
          email: user.email,
        },
      })
      .expect(200)
      .then((res) => {
        const { userByEmail } = res.body.data;

        expect(userByEmail.statusCode).toBe(HttpStatus.FOUND);
        expect(userByEmail.messageCode).toBe(MessageCode.USER_FOUND);
        expect(userByEmail.data).toBeDefined();

        expect(userByEmail.data._id).toBeDefined();
        expect(userByEmail.data.firstname).toBe(user.firstname);
        expect(userByEmail.data.lastname).toBe(user.lastname);
        expect(userByEmail.data.password).not.toBe(user.password);
        expect(userByEmail.data.email).toBe(user.email);
        expect(userByEmail.data.role).toBeDefined();
        expect(userByEmail.data.role).toBe("user");
      });
  });

  it("Get a user by empty email", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_EMAIL,
        variables: {
          email: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_MAIL_REQUIRED);
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a user by invalid email", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_EMAIL,
        variables: {
          email: `2472874282msfbhjhwu`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.messageCode).toBe(MessageCode.USER_MAIL_INVALID);
        expect(res.body.data).toBeNull();
      });
  });

  it("Update a user", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_USER,
        variables: {
          input: {
            ...updatedUser,
          },
        },
      })
      .expect(200)
      .then((res) => {
        const { updateUser } = res.body.data;

        expect(updateUser.statusCode).toBe(HttpStatus.OK);
        expect(updateUser.messageCode).toBe(MessageCode.USER_UPDATED);
        expect(updateUser.data).toBeDefined();

        expect(updateUser.data._id).toBeDefined();
        expect(updateUser.data.updatedAt).toBeDefined();
        expect(updateUser.data.firstname).toBe(updatedUser.firstname);
        expect(updateUser.data.lastname).toBe(updatedUser.lastname);
        expect(updateUser.data.avatar).toBe(updatedUser.avatar);
      });
  });

  it("Update a user with empty id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_USER,
        variables: {
          input: {
            _id: "",
          },
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_ID_REQUIRED);
        expect(res.body.data).toBeNull();
      });
  });

  it("Update a user with invalid id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_USER,
        variables: {
          input: {
            _id: `${updatedUser._id}${updatedUser._id}`,
          },
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_ID_INVALID);
        expect(res.body.data).toBeNull();
      });
  });

  it("Remove a user", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_USER,
        variables: {
          id: updatedUser._id,
        },
      })
      // .expect(200)
      .then((res) => {
        console.log(res);
        const { removeUser } = res.body.data;

        expect(removeUser.statusCode).toBe(HttpStatus.OK);
        expect(removeUser.messageCode).toBe(MessageCode.USER_REMOVED);
        expect(removeUser.data).toBeDefined();
      });
  });

  it("Remove a user with empty id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_USER,
        variables: {
          id: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_ID_REQUIRED);
        expect(res.body.data).toBeNull();
      });
  });

  it("Remove a user with invalid id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_USER,
        variables: {
          id: `${updatedUser._id}${updatedUser._id}`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.USER_ID_INVALID);
        expect(res.body.data).toBeNull();
      });
  });
});
