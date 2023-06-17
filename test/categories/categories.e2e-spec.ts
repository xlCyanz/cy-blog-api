import * as R from "radash";
import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";

import { FakeUtils } from "@utils";
import { AppModule } from "@/app.module";
import { IUpdateCategory, MessageCode } from "@interfaces";

import {
  CREATE_CATEGORY,
  REMOVE_CATEGORY,
  UPDATE_CATEGORY,
  GET_CATEGORY_BY_ID,
  GET_ALL_CATEGORIES,
  GET_CATEGORY_BY_NAME,
} from "./categories.graphql";

describe("Categories (e2e)", () => {
  let app: INestApplication;
  const path = "/graphql";
  const faker = new FakeUtils();

  const category = R.omit(faker.getCategory(), ["id"]);

  const categoryUpdated: IUpdateCategory = {
    id: null,
    ...category,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => await app.close());

  it("Query tests should not have a typename", async () => {
    expect(CREATE_CATEGORY.includes("typename")).toBe(false);
    expect(REMOVE_CATEGORY.includes("typename")).toBe(false);
    expect(UPDATE_CATEGORY.includes("typename")).toBe(false);
    expect(GET_CATEGORY_BY_ID.includes("typename")).toBe(false);
    expect(GET_ALL_CATEGORIES.includes("typename")).toBe(false);
    expect(GET_CATEGORY_BY_NAME.includes("typename")).toBe(false);
  });

  it("Create a category", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_CATEGORY,
        variables: {
          ...category,
        },
      })
      .expect(200)
      .then((res) => {
        const { createCategory } = res.body.data;

        expect(createCategory.statusCode).toBe(HttpStatus.CREATED);
        expect(createCategory.messageCode).toBe(MessageCode.CATEGORY_CREATED);
        expect(createCategory.data).toBeDefined();

        expect(createCategory.data._id).toBeDefined();
        expect(createCategory.data.name).toBe(category.name);
        expect(createCategory.data.description).toBe(category.description);
      }));

  it("Create a duplicate category", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_CATEGORY,
        variables: {
          ...category,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_ALREADY_EXISTS);
        expect(res.body.data).toBeNull();
      }));

  it("Find all categories", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_ALL_CATEGORIES,
      })
      .expect(200)
      .then((res) => {
        const { categories } = res.body.data;

        expect(categories.data).toBeDefined();
        expect(categories.statusCode).toBe(HttpStatus.FOUND);
        expect(categories.messageCode).toBe(MessageCode.CATEGORIES_FOUND);
        expect(categories.data.length).toBeGreaterThan(0);
      });
  });

  it("Find a category by name", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_CATEGORY_BY_NAME,
        variables: {
          name: category.name,
        },
      })
      .expect(200)
      .then((res) => {
        const { categoryByName } = res.body.data;

        expect(categoryByName.data).toBeDefined();
        expect(categoryByName.statusCode).toBe(HttpStatus.FOUND);
        expect(categoryByName.messageCode).toBe(MessageCode.CATEGORY_FOUND);

        expect(categoryByName.data._id).toBeDefined();
        expect(categoryByName.data.name).toBe(category.name);
        expect(categoryByName.data.description).toBe(category.description);

        categoryUpdated.id = categoryByName.data.id;
      }));

  it("Find a category by empty name", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_CATEGORY_BY_NAME,
        variables: {
          name: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_NAME_REQUIRED);
        expect(res.body.data).toBeNull();
      }));

  it("Find a category by id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_CATEGORY_BY_ID,
        variables: {
          id: categoryUpdated.id,
        },
      })
      .expect(200)
      .then((res) => {
        const { categoryById } = res.body.data;

        expect(categoryById.statusCode).toBe(HttpStatus.FOUND);
        expect(categoryById.messageCode).toBe(MessageCode.CATEGORY_FOUND);

        expect(categoryById.data.id).toBeDefined();
        expect(categoryById.data.name).toBe(category.name);
        expect(categoryById.data.description).toBe(category.description);
      }));

  it("Find a category by empty id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_CATEGORY_BY_ID,
        variables: {
          id: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_ID_REQUIRED);
        expect(res.body.data).toBeNull();
      }));

  it("Find a category by invalid id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_CATEGORY_BY_ID,
        variables: {
          id: `yff48q4vmqlmh6loang85yphyff48q4vmqloang85yph`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_ID_INVALID);
        expect(res.body.data).toBeNull();
      }));

  it("Update a category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_CATEGORY,
        variables: {
          ...categoryUpdated,
        },
      })
      .expect(200)
      .then((res) => {
        const { updateCategory } = res.body.data;

        expect(updateCategory.statusCode).toBe(HttpStatus.OK);
        expect(updateCategory.messageCode).toBe(MessageCode.CATEGORY_UPDATED);
        expect(updateCategory.data).toBeDefined();

        expect(updateCategory.data._id).toBeDefined();
        expect(updateCategory.data.name).toBe(categoryUpdated.name);
        expect(updateCategory.data.description).toBe(
          categoryUpdated.description,
        );
      });
  });

  it("Update a category with empty id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_CATEGORY,
        variables: {
          _id: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_ID_REQUIRED);
        expect(res.body.data).toBeNull();
      });
  });

  it("Update a category with invalid id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_CATEGORY,
        variables: {
          _id: "yff48q4vmql2323232ng85yphyff48q4vmqloang85yph2442",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_ID_INVALID);
        expect(res.body.data).toBeNull();
      });
  });

  it("Remove a category", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_CATEGORY,
        variables: {
          id: categoryUpdated.id,
        },
      })
      .expect(200)
      .then((res) => {
        const { removeCategory } = res.body.data;

        expect(removeCategory.statusCode).toBe(HttpStatus.OK);
        expect(removeCategory.messageCode).toBe(MessageCode.CATEGORY_REMOVED);
        expect(removeCategory.data).toBeDefined();
      }));

  it("Remove a category with empty id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_CATEGORY,
        variables: {
          id: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_ID_REQUIRED);
        expect(res.body.data).toBeNull();
      }));

  it("Remove a invalid category", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_CATEGORY,
        variables: {
          id: "28462842698426",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.CATEGORY_ID_INVALID);
        expect(res.body.data).toBeNull();
      }));
});
