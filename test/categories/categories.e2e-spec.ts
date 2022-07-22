import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { CREATE_CATEGORY } from "./categories.graphql";

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

  afterAll(async () => {
    console.log("Closing server test");
    await app.close();
  });

  const category = {
    name: "Test Category 1",
    description: "Test Category Description",
  };

  it("Create a category", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_CATEGORY,
        variables: {
          input: {
            ...category,
          },
        },
      })
      .expect(200)
      .then((res) => {
        const { createCategory } = res.body.data;

        expect(createCategory._id).toBeDefined();
        expect(createCategory.name).toBe(category.name);
        expect(createCategory.description).toBe(category.description);
      }));

  it("Create a duplicate category (error)", async () =>
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_CATEGORY,
        variables: {
          input: {
            ...category,
          },
        },
      })
      .expect(200));
});
