import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";

import Utilities from "../../src/utils/utilities";
import FakeUtils from "../../src/utils/fake-utils";
import { AppModule } from "../../src/app.module";
import { ICategory, MessageCode } from "../../src/interfaces";
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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => await app.close());

  const faker = new FakeUtils();

  const category = (() =>
    Utilities.omitFromObjectProperties<ICategory>(faker.getCategory(), [
      "_id",
    ]))();

  const categoryUpdated: ICategory = {
    _id: null,
    ...(Utilities.omitFromObjectProperties<ICategory>(faker.getCategory(), [
      "_id",
    ]) as unknown as ICategory),
  };

  it("No query test should have typename", async () => {
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

        categoryUpdated._id = categoryByName.data._id;
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
        console.log(res.body.errors);
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
          id: categoryUpdated._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { categoryById } = res.body.data;

        expect(categoryById.statusCode).toBe(HttpStatus.FOUND);
        expect(categoryById.messageCode).toBe(MessageCode.CATEGORY_FOUND);

        expect(categoryById.data._id).toBeDefined();
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

  // it("Update a category", async () => {
  //   const newCategory = {
  //     id: category._id,
  //     name: "Test Category 1 Updated",
  //     description: "Test Category Description 1 Updated",
  //   };

  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: UPDATE_CATEGORY,
  //       variables: {
  //         ...newCategory,
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const { updateCategory } = res.body.data;

  //       expect(updateCategory.statusCode).toBe(HttpStatus.OK);
  //       expect(updateCategory.message).toBe("Category updated");
  //       expect(updateCategory.data).toBeDefined();

  //       expect(updateCategory.data._id).toBeDefined();
  //       expect(updateCategory.data.name).toBe(newCategory.name);
  //       expect(updateCategory.data.description).toBe(newCategory.description);
  //     });
  // });

  // it("Update a category with empty id", async () => {
  //   const newCategory = {
  //     id: "",
  //     name: "Test Category 1 Updated",
  //     description: "Test Category Description 1 Updated",
  //   };

  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: UPDATE_CATEGORY,
  //       variables: {
  //         ...newCategory,
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const error = res.body.errors[0];

  //       expect(error.extensions.response.statusCode).toBe(
  //         HttpStatus.BAD_REQUEST,
  //       );
  //       expect(error.message).toBe("Category id is required");
  //       expect(res.body.data).toBeNull();
  //     });
  // });

  // it("Remove a category", async () =>
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: REMOVE_CATEGORY,
  //       variables: {
  //         id: category._id,
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const { removeCategory } = res.body.data;

  //       expect(removeCategory.statusCode).toBe(HttpStatus.OK);
  //       expect(removeCategory.message).toBe("Category removed");
  //       expect(removeCategory.data).toBeDefined();
  //     }));

  // it("Remove a category with empty id", async () =>
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: REMOVE_CATEGORY,
  //       variables: {
  //         id: "",
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const error = res.body.errors[0];

  //       expect(error.extensions.response.statusCode).toBe(
  //         HttpStatus.BAD_REQUEST,
  //       );
  //       expect(error.message).toBe("Category id is required");
  //       expect(res.body.data).toBeNull();
  //     }));

  // it("Remove a invalid category", async () =>
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: REMOVE_CATEGORY,
  //       variables: {
  //         id: category._id,
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const error = res.body.errors[0];

  //       expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
  //       expect(error.message).toBe("Category not found");
  //       expect(res.body.data).toBeNull();
  //     }));
});
