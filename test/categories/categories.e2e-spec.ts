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

  it("CREATE CATEGORY", async () => {
    const server = request(app.getHttpServer());

    const newCategory = await server.post(path).send({
      query: CREATE_CATEGORY,
      variables: {
        input: {
          name: "Test Category",
          description: "Test Category Description",
        },
      },
    });

    console.log(
      "🚀 ~ file: categories.e2e-spec.ts ~ line 33 ~ getAllCategories ~ getAllCategories",
      newCategory.body,
    );
  });
});
