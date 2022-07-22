import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
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

  let category = {
    _id: null,
    name: "Test Category 1",
    description: "Test Category Description 1",
  };

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
        expect(createCategory.message).toBe("Category created");
        expect(createCategory.data).toBeDefined();

        expect(createCategory.data._id).toBeDefined();
        expect(createCategory.data.name).toBe(category.name);
        expect(createCategory.data.description).toBe(category.description);
      }));

  it("Create a duplicate category (error)", async () =>
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe(
          `Category named ${category.name} already exists`,
        );
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
        expect(categories.message).toBe("Categories found");
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
        expect(categoryByName.message).toBe("Category found");

        expect(categoryByName.data._id).toBeDefined();
        expect(categoryByName.data.name).toBe(category.name);
        expect(categoryByName.data.description).toBe(category.description);

        category = categoryByName.data;
      }));

  it("Find a category by invalid name", async () =>
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Category name is required");
        expect(res.body.data).toBeNull();
      }));

  it("Find a category by id", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_CATEGORY_BY_ID,
        variables: {
          id: category._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { categoryById } = res.body.data;

        expect(categoryById.statusCode).toBe(HttpStatus.FOUND);
        expect(categoryById.message).toBe("Category found");

        expect(categoryById.data._id).toBeDefined();
        expect(categoryById.data.name).toBe(category.name);
        expect(categoryById.data.description).toBe(category.description);
      }));

  it("Find a category by invalid id", async () =>
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Category id is required");
        expect(res.body.data).toBeNull();
      }));

  it("Update a category", async () => {
    const newCategory = {
      id: category._id,
      name: "Test Category 1 Updated",
      description: "Test Category Description 1 Updated",
    };

    await request(app.getHttpServer())
      .post(path)
      .send({
        query: UPDATE_CATEGORY,
        variables: {
          ...newCategory,
        },
      })
      .expect(200)
      .then((res) => {
        const { updateCategory } = res.body.data;

        expect(updateCategory.statusCode).toBe(HttpStatus.OK);
        expect(updateCategory.message).toBe("Category updated");
        expect(updateCategory.data).toBeDefined();

        expect(updateCategory.data._id).toBeDefined();
        expect(updateCategory.data.name).toBe(newCategory.name);
        expect(updateCategory.data.description).toBe(newCategory.description);
      });
  });

  it("Remove a category", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_CATEGORY,
        variables: {
          id: category._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { removeCategory } = res.body.data;

        expect(removeCategory.statusCode).toBe(HttpStatus.OK);
        expect(removeCategory.message).toBe("Category removed");
        expect(removeCategory.data).toBeDefined();
      }));

  it("Remove a invalid category", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: REMOVE_CATEGORY,
        variables: {
          id: category._id,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("Category not found");
        expect(res.body.data).toBeNull();
      }));
});
