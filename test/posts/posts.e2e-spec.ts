import * as request from "supertest";
import { omit } from "radash";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";

import { FakeUtils } from "@utils";
import { AppModule } from "@/app.module";
import { MessageCode } from "@constants";

import { CREATE_USER } from "../users/users.graphql";
import { CREATE_CATEGORY } from "../categories/categories.graphql";
import {
  GET_POSTS,
  CREATE_POST,
  REMOVE_POST,
  UPDATE_POST,
  PUBLISH_POST,
  GET_POST_BY_ID,
  GET_POST_BY_SLUG,
  GET_POST_BY_TITLE,
  GET_POSTS_BY_AUTHOR,
  GET_POSTS_BY_CATEGORY,
  GET_POSTS_BY_AUTHOR_AND_CATEGORY,
} from "./posts.graphql";

describe("Posts (e2e)", () => {
  let app: INestApplication;
  const path = "/graphql";
  const faker = new FakeUtils();

  const post = faker.getPost();
  const category = faker.getCategory();
  const author = faker.getUser();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => await app.close());

  it("No query test should have typename", async () => {
    expect(GET_POSTS.includes("typename")).toBe(false);
    expect(GET_POST_BY_ID.includes("typename")).toBe(false);
    expect(GET_POST_BY_TITLE.includes("typename")).toBe(false);
    expect(GET_POST_BY_SLUG.includes("typename")).toBe(false);
    expect(GET_POSTS_BY_CATEGORY.includes("typename")).toBe(false);
    expect(GET_POSTS_BY_AUTHOR.includes("typename")).toBe(false);
    expect(GET_POSTS_BY_AUTHOR_AND_CATEGORY.includes("typename")).toBe(false);
    expect(CREATE_POST.includes("typename")).toBe(false);
    expect(UPDATE_POST.includes("typename")).toBe(false);
    expect(REMOVE_POST.includes("typename")).toBe(false);
  });

  it("Create a category", async () => {
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
        expect(createCategory.data.id).toBeDefined();
        expect(createCategory.data.name).toBe(category.name);
        expect(createCategory.data.description).toBe(category.description);

        post.categoryId = Number(createCategory.data.id);

        expect(post.categoryId).toBeDefined();
        expect(post.categoryId).not.toBeNull();
      });
  });

  it("Create an author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_USER,
        variables: {
          input: {
            ...omit(author, ["id"]),
          },
        },
      })
      .expect(200)
      .then((res) => {
        const { createUser } = res.body.data;

        expect(createUser).toBeDefined();
        expect(createUser.statusCode).toBe(HttpStatus.CREATED);
        expect(createUser.messageCode).toBe(MessageCode.USER_CREATED);

        expect(createUser.data).toBeDefined();
        expect(createUser.data.firstName).toBe(author.firstName);
        expect(createUser.data.lastName).toBe(author.lastName);
        expect(createUser.data.password).not.toBeDefined();
        expect(createUser.data.email).toBe(author.email);
        expect(createUser.data.avatar).toBe(author.avatar);

        post.authorId = Number(createUser.data.id);

        expect(post.authorId).toBeDefined();
        expect(post.authorId).not.toBeNull();
      });
  });

  it("Create a post", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_POST,
        variables: {
          input: omit(post, ["id"]),
        },
      })
      .expect(200)
      .then((res) => {
        const { createPost } = res.body.data;

        expect(createPost.statusCode).toBe(HttpStatus.CREATED);
        expect(createPost.messageCode).toBe(MessageCode.POST_CREATED);
        expect(createPost.data).toBeDefined();

        expect(createPost.data.title).toBe(post.title);
        expect(createPost.data.content).toBe(post.content);
        expect(createPost.data.image).toBe(post.image);
        expect(createPost.data.categoryId).toBe(post.categoryId);
        expect(createPost.data.authorId).toBe(post.authorId);

        post.id = Number(createPost.data.id);
        post.slug = createPost.data.slug;

        expect(post.id).toBeDefined();
        expect(post.id).not.toBeNull();
      });
  });

  it("Publish post", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: PUBLISH_POST,
        variables: {
          id: post.id,
        },
      })
      .expect(200)
      .then((res) => {
        const { publishPost } = res.body.data;

        expect(publishPost.statusCode).toBe(HttpStatus.OK);
        expect(publishPost.messageCode).toBe(MessageCode.POST_PUBLISHED);
        expect(publishPost.data).toBeDefined();

        expect(publishPost.data.id).toBe(post.id);
        expect(publishPost.data.published).toBe(true);
      });
  });

  it("Create a post with invalid category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_POST,
        variables: {
          input: {
            ...omit(post, ["id", "slug"]),
            categoryId: 0,
          },
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

  it("Create a post with invalid author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_POST,
        variables: {
          input: {
            ...omit(post, ["id", "slug"]),
            authorId: 0,
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

  it("Get all posts", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS,
      })
      .expect(200)
      .then((res) => {
        const { posts } = res.body.data;

        expect(posts.statusCode).toBe(HttpStatus.FOUND);
        expect(posts.messageCode).toBe(MessageCode.POSTS_FOUND);

        expect(posts).toBeDefined();
        expect(posts.data).toBeDefined();
        expect(posts.data.length).toBeGreaterThan(0);
      });
  });

  it("Get a post by id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_ID,
        variables: {
          id: post.id,
        },
      })
      .expect(200)
      .then((res) => {
        const { post: postById } = res.body.data;

        expect(postById.statusCode).toBe(HttpStatus.FOUND);
        expect(postById.messageCode).toBe(MessageCode.POST_FOUND);

        expect(postById).toBeDefined();
        expect(postById.data.title).toBe(post.title);
        expect(postById.data.content).toBe(post.content);
        expect(postById.data.image).toBe(post.image);
        expect(postById.data.categoryId).toBe(post.categoryId);
        expect(postById.data.authorId).toBe(post.authorId);
      });
  });

  it("Get a post by wrong id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_ID,
        variables: {
          id: 0,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.POST_ID_REQUIRED);
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a post by title", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_TITLE,
        variables: {
          title: post.title,
        },
      })
      .expect(200)
      .then((res) => {
        const { postsByTitle } = res.body.data;

        expect(postsByTitle.statusCode).toBe(HttpStatus.FOUND);
        expect(postsByTitle.messageCode).toBe(MessageCode.POSTS_FOUND);

        expect(postsByTitle.data[0]).toBeDefined();
        expect(postsByTitle.data[0].title).toBe(post.title);
        expect(postsByTitle.data[0].content).toBe(post.content);
        expect(postsByTitle.data[0].image).toBe(post.image);
      });
  });

  it("Get a post by empty title", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_TITLE,
        variables: {
          title: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.POST_TITLE_REQUIRED);
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a post by slug", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_SLUG,
        variables: {
          slug: post.slug,
        },
      })
      .expect(200)
      .then((res) => {
        const { postBySlug } = res.body.data;

        expect(postBySlug.statusCode).toBe(HttpStatus.FOUND);
        expect(postBySlug.messageCode).toBe(MessageCode.POST_FOUND);

        expect(postBySlug.data).toBeDefined();
        expect(postBySlug.data.title).toBe(post.title);
        expect(postBySlug.data.content).toBe(post.content);
        expect(postBySlug.data.image).toBe(post.image);
        expect(postBySlug.data.categoryId).toBe(post.categoryId);
        expect(postBySlug.data.authorId).toBe(post.authorId);
      });
  });

  it("Get a post by empty slug", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_SLUG,
        variables: {
          slug: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0].extensions.response;

        expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.messageCode).toBe(MessageCode.POST_SLUG_REQUIRED);
        expect(res.body.data).toBeNull();
      });
  });

  it("Get posts by category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_CATEGORY,
        variables: {
          categoryId: post.categoryId,
        },
      })
      .expect(200)
      .then((res) => {
        const { postsByCategory } = res.body.data;

        expect(postsByCategory.statusCode).toBe(HttpStatus.FOUND);
        expect(postsByCategory.messageCode).toBe(MessageCode.POSTS_FOUND);

        expect(postsByCategory.data[0]).toBeDefined();
        expect(postsByCategory.data[0].title).toBe(post.title);
        expect(postsByCategory.data[0].content).toBe(post.content);
        expect(postsByCategory.data[0].image).toBe(post.image);
        expect(postsByCategory.data[0].categoryId).toBe(post.categoryId);
      });
  });

  it("Get posts by empty category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_CATEGORY,
        variables: {
          categoryId: 0,
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

  // it("Get posts by author", async () => {
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: GET_POSTS_BY_AUTHOR,
  //       variables: {
  //         author: author.id,
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const { postsByAuthor } = res.body.data;

  //       expect(postsByAuthor.statusCode).toBe(HttpStatus.FOUND);
  //       expect(postsByAuthor.messageCode).toBe(MessageCode.POSTS_FOUND);

  //       expect(postsByAuthor).toBeDefined();
  //       expect(postsByAuthor.length).toBeGreaterThan(0);
  //     });
  // });

  // it("Get posts by empty author", async () => {
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: GET_POSTS_BY_AUTHOR,
  //       variables: {
  //         author: "",
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const error = res.body.errors[0].extensions.response;

  //       expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
  //       expect(error.messageCode).toBe(MessageCode.USER_ID_REQUIRED);
  //       expect(res.body.data).toBeNull();
  //     });
  // });

  // it("Get posts by author and category", async () => {
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
  //       variables: {
  //         author: author.id,
  //         category: category.id,
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const { postsByAuthorAndCategory } = res.body.data;

  //       expect(postsByAuthorAndCategory.statusCode).toBe(HttpStatus.FOUND);
  //       expect(postsByAuthorAndCategory.messageCode).toBe(
  //         MessageCode.POSTS_FOUND,
  //       );

  //       expect(postsByAuthorAndCategory).toBeDefined();
  //       expect(postsByAuthorAndCategory.length).toBeGreaterThan(0);
  //     });
  // });

  // it("Get posts by empty author and category", async () => {
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
  //       variables: {
  //         author: "",
  //         category: category.id,
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const error = res.body.errors[0].extensions.response;

  //       expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
  //       expect(error.messageCode).toBe(MessageCode.USER_ID_REQUIRED);
  //       expect(res.body.data).toBeNull();
  //     });
  // });

  // it("Get posts by author and empty category", async () => {
  //   await request(app.getHttpServer())
  //     .post(path)
  //     .send({
  //       query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
  //       variables: {
  //         author: author.id,
  //         category: "",
  //       },
  //     })
  //     .expect(200)
  //     .then((res) => {
  //       const error = res.body.errors[0].extensions.response;

  //       expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
  //       expect(error.messageCode).toBe(MessageCode.CATEGORY_ID_REQUIRED);
  //       expect(res.body.data).toBeNull();
  //     });
  // });
});
