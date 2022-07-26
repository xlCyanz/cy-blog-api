import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

describe("Blogs (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => await app.close());

  const blog = {
    _id: null,
    title: "Test Blog 1",
    description: "Test Blog Description 1",
    content: "Test Blog Content 1",
    image: "Test Blog Image 1",
    category: {
      _id: null,
    },
    user: {
      _id: null,
    },
  };

  it("Test fake", async () => {
    expect(true).toBe(true);
  });
});
