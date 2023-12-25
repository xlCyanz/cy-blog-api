import * as R from "radash";
import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";

import { FakeUtils } from "@utils";
import { AppModule } from "@/app.module";
import { MessageCode } from "@constants";
import { IUpdateUser } from "@interfaces";

import { CREATE_USER, REMOVE_USER, UPDATE_USER } from "./users.graphql";

describe("Users (e2e)", () => {
  let app: INestApplication;
  const path = "/graphql";
  const faker = new FakeUtils();

  const user = R.omit(faker.getUser(), ["id", "roles"]);

  const updatedUser: IUpdateUser = {
    id: null,
    ...R.omit(user, ["email", "password"]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => await app.close());

  it("No query test should have typename", async () => {
    expect(CREATE_USER.includes("typename")).toBe(false);
    expect(REMOVE_USER.includes("typename")).toBe(false);
    expect(UPDATE_USER.includes("typename")).toBe(false);
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

        expect(createUser.data.id).toBeDefined();
        expect(createUser.data.firstName).toBe(user.firstName);
        expect(createUser.data.lastName).toBe(user.lastName);
        expect(createUser.data.password).not.toBe(user.password);
        expect(createUser.data.email).toBe(user.email);
        expect(createUser.data.createdAt).toBeDefined();

        updatedUser.id = createUser.data.id;
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

        expect(error.statusCode).toBe(HttpStatus.CONFLICT);
        expect(error.messageCode).toBe(MessageCode.USER_ALREADY_EXISTS);
        expect(res.body.data).toBeNull();
      }));

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

        expect(updateUser.data.id).toBeDefined();
        expect(updateUser.data.updatedAt).toBeDefined();
        expect(updateUser.data.firstName).toBe(updatedUser.firstName);
        expect(updateUser.data.lastName).toBe(updatedUser.lastName);
      });
  });

  it("Update a user with wrong id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_USER,
        variables: {
          input: {
            id: 0,
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

  it("Remove a user", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_USER,
        variables: {
          id: updatedUser.id,
        },
      })
      .expect(200)
      .then((res) => {
        const { removeUser } = res.body.data;

        expect(removeUser.statusCode).toBe(HttpStatus.OK);
        expect(removeUser.messageCode).toBe(MessageCode.USER_REMOVED);
        expect(removeUser.data).toBeDefined();
      });
  });

  it("Remove a user with wrong id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_USER,
        variables: {
          id: 0,
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
});
