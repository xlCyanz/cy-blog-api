import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
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

  const user = {
    _id: null,
    name: "Test User 1",
    password: "Test User Password 1",
    email: "Test User Email 1",
    avatar: "Test User Avatar 1",
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
          ...user,
        },
      })
      .expect(200)
      .then((res) => {
        const { createUser } = res.body.data;

        expect(createUser.statusCode).toBe(HttpStatus.CREATED);
        expect(createUser.message).toBe("User created");
        expect(createUser.data).toBeDefined();

        expect(createUser.data._id).toBeDefined();
        expect(createUser.data.name).toBe(user.name);
        expect(createUser.data.password).not.toBe(user.password);
        expect(createUser.data.email).toBe(user.email);
        expect(createUser.data.role).toBeDefined();
        expect(createUser.data.role).toBe("user");
        expect(createUser.data.avatar).toBe(user.avatar);

        user._id = createUser.data._id;
      }));

  it("Create a duplicate user", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_USER,
        variables: {
          ...user,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe(`User named ${user.name} already exists`);
        expect(res.body.data).toBeNull();
      }));

  it("Get a user by id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_ID,
        variables: {
          id: user._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { userById } = res.body.data;

        expect(userById.statusCode).toBe(HttpStatus.OK);
        expect(userById.message).toBe("User found");
        expect(userById.data).toBeDefined();

        expect(userById.data._id).toBeDefined();
        expect(userById.data.name).toBe(user.name);
        expect(userById.data.password).toBe(user.password);
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
          _id: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("User id is required");
        expect(res.body.data).toBeNull();
      }));

  it("Get a user by invalid id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_ID,
        variables: {
          _id: `${user._id}${user._id}`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("User id is invalid");
        expect(res.body.data).toBeNull();
      }));

  it("Get a user by name", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_NAME,
        variables: {
          name: user.name,
        },
      })
      .expect(200)
      .then((res) => {
        const { userByName } = res.body.data;

        expect(userByName.statusCode).toBe(HttpStatus.OK);
        expect(userByName.message).toBe("User found");
        expect(userByName.data).toBeDefined();

        expect(userByName.data._id).toBeDefined();
        expect(userByName.data.name).toBe(user.name);
        expect(userByName.data.password).toBe(user.password);
        expect(userByName.data.email).toBe(user.email);
        expect(userByName.data.role).toBeDefined();
        expect(userByName.data.role).toBe("user");
      });
  });

  it("Get a user by empty name", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_NAME,
        variables: {
          name: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("User name is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a user by invalid name", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_NAME,
        variables: {
          name: `${user.name}${user.name}`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("User not found");
        expect(res.body.data).toBeNull();
      });
  });

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

        expect(userByEmail.statusCode).toBe(HttpStatus.OK);
        expect(userByEmail.message).toBe("User found");
        expect(userByEmail.data).toBeDefined();

        expect(userByEmail.data._id).toBeDefined();
        expect(userByEmail.data.name).toBe(user.name);
        expect(userByEmail.data.password).toBe(user.password);
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("User email is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a user by invalid email", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_USER_BY_EMAIL,
        variables: {
          email: `${user.email}${user.email}`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("User not found");
        expect(res.body.data).toBeNull();
      });
  });

  it("Update a user", async () => {
    const newUser = {
      name: "Test User 1 Updated!",
      password: "Test User Password 1 Updated!",
      email: "Test User Email 1 Updated!",
      avatar: "Test User Avatar 1 Updated!",
    };

    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_USER,
        variables: {
          id: user._id,
          ...newUser,
        },
      })
      .expect(200)
      .then((res) => {
        const { updateUser } = res.body.data;

        expect(updateUser.statusCode).toBe(HttpStatus.OK);
        expect(updateUser.message).toBe("User updated");
        expect(updateUser.data).toBeDefined();

        expect(updateUser.data._id).toBeDefined();
        expect(updateUser.data.name).toBe(newUser.name);
        expect(updateUser.data.password).toBe(newUser.password);
        expect(updateUser.data.email).toBe(newUser.email);
        expect(updateUser.data.avatar).toBe(newUser.avatar);
      });
  });

  it("Update a user with empty id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_USER,
        variables: {
          id: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("User id is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Update a user with invalid id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_USER,
        variables: {
          id: `${user._id}${user._id}`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("User not found");
        expect(res.body.data).toBeNull();
      });
  });

  it("Remove a user", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_USER,
        variables: {
          id: user._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { removeUser } = res.body.data;

        expect(removeUser.statusCode).toBe(HttpStatus.OK);
        expect(removeUser.message).toBe("User removed");
        expect(removeUser.data).toBeDefined();

        expect(removeUser.data._id).toBeDefined();
        expect(removeUser.data.name).toBe(user.name);
        expect(removeUser.data.password).toBe(user.password);
        expect(removeUser.data.email).toBe(user.email);
        expect(removeUser.data.avatar).toBe(user.avatar);
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("User id is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Remove a user with invalid id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_USER,
        variables: {
          id: `${user._id}${user._id}`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("User not found");
        expect(res.body.data).toBeNull();
      });
  });
});
