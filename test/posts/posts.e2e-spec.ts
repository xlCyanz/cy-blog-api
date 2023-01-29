import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";

import FakeUtils from "../../src/utils/fake-utils";
import { AppModule } from "../../src/app.module";
import { CREATE_USER } from "../users/users.graphql";
import { CREATE_CATEGORY } from "../categories/categories.graphql";
import {
  GET_POST,
  GET_POSTS,
  CREATE_POST,
  REMOVE_POST,
  UPDATE_POST,
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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => await app.close());

  it("No query test should have typename", async () => {
    expect(GET_POSTS.includes("typename")).toBe(false);
    expect(GET_POST.includes("typename")).toBe(false);
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

  it("Create a category and an author", async () => {
    const server = request(app.getHttpServer());

    await server
      .post(path)
      .send({
        query: CREATE_CATEGORY,
        variables: {
          name: category.name,
          description: category.description,
        },
      })
      .expect(200)
      .then((res) => {
        const { createCategory } = res.body.data;

        expect(createCategory.statusCode).toBe(HttpStatus.CREATED);
        expect(createCategory.message).toBe("Category created");

        expect(createCategory).toBeDefined();
        expect(createCategory.name).toBe(category.name);
        expect(createCategory.description).toBe(category.description);

        post.category = createCategory._id;
        category._id = createCategory._id;

        expect(post.category).toBeDefined();
        expect(post.category).not.toBeNull();
      });

    await server
      .post(path)
      .send({
        query: CREATE_USER,
        variables: {
          firstname: author.firstname,
          lastname: author.lastname,
          password: author.password,
          email: author.email,
          avatar: author.avatar,
        },
      })
      .expect(200)
      .then((res) => {
        const { createUser } = res.body.data;

        expect(createUser.statusCode).toBe(HttpStatus.CREATED);
        expect(createUser.message).toBe("User created");

        expect(createUser).toBeDefined();
        expect(createUser.firstname).toBe(author.firstname);
        expect(createUser.lastname).toBe(author.lastname);
        expect(createUser.password).not.toBe(author.password);
        expect(createUser.email).toBe(author.email);
        expect(createUser.avatar).toBe(author.avatar);

        post.author = createUser._id;
        author._id = createUser._id;

        expect(post.author).toBeDefined();
        expect(post.author).not.toBeNull();
      });
  });

  it("Create a post", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_POST,
        variables: {
          title: post.title,
          content: post.content,
          image: post.image,
          categoryId: post.category,
          authorId: post.author,
        },
      })
      .expect(200)
      .then((res) => {
        const { createPost } = res.body.data;

        expect(createPost.statusCode).toBe(HttpStatus.CREATED);
        expect(createPost.message).toBe("Post created");

        expect(createPost).toBeDefined();
        expect(createPost.title).toBe(post.title);
        expect(createPost.content).toBe(post.content);
        expect(createPost.image).toBe(post.image);
        expect(createPost.category).toBe(post.category);
        expect(createPost.author).toBe(post.author);

        post._id = createPost._id;
        post.slug = createPost.slug;

        expect(post._id).toBeDefined();
        expect(post._id).not.toBeNull();
      });
  });

  it("Create a post with invalid category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_POST,
        variables: {
          title: post.title,
          content: post.content,
          image: post.image,
          category: "invalid",
          author: post.author,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("Category not found");
        expect(res.body.data).toBeNull();
      });
  });

  it("Create a post with invalid author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_POST,
        variables: {
          title: post.title,
          content: post.content,
          image: post.image,
          category: post.category,
          author: "invalid",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("Author not found");
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
        expect(posts.message).toBe("posts found");

        expect(posts).toBeDefined();
        expect(posts.length).toBeGreaterThan(0);
      });
  });

  it("Get a post by id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_ID,
        variables: {
          id: post._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { post } = res.body.data;

        expect(post.statusCode).toBe(HttpStatus.FOUND);
        expect(post.message).toBe("post found");

        expect(post).toBeDefined();
        expect(post.title).toBe(post.title);
        expect(post.description).toBe(post.description);
        expect(post.content).toBe(post.content);
        expect(post.image).toBe(post.image);
        expect(post.category).toBe(post.category);
        expect(post.author).toBe(post.author);
      });
  });

  it("Get a post by empty id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_ID,
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
        expect(error.message).toBe("post id is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a post by invalid id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_ID,
        variables: {
          id: `${post._id}invalid`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Post id is invalid");
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
        const { postByTitle } = res.body.data;

        expect(postByTitle.statusCode).toBe(HttpStatus.FOUND);
        expect(postByTitle.message).toBe("post found");

        expect(postByTitle).toBeDefined();
        expect(postByTitle.title).toBe(post.title);
        expect(postByTitle.content).toBe(post.content);
        expect(postByTitle.image).toBe(post.image);
        expect(postByTitle.category).toBe(post.category);
        expect(postByTitle.author).toBe(post.author);
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Post title is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a Post by invalid title", async () => {
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Post title is invalid");
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
        expect(postBySlug.message).toBe("post found");

        expect(postBySlug).toBeDefined();
        expect(postBySlug.title).toBe(post.title);
        expect(postBySlug.content).toBe(post.content);
        expect(postBySlug.image).toBe(post.image);
        expect(postBySlug.category).toBe(post.category);
        expect(postBySlug.author).toBe(post.author);
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
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Post slug is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a post by invalid slug", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POST_BY_SLUG,
        variables: {
          slug: `${post.slug}invalid`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("Post not found");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get posts by category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_CATEGORY,
        variables: {
          category: post.category,
        },
      })
      .expect(200)
      .then((res) => {
        const { postByCategory } = res.body.data;

        expect(postByCategory.statusCode).toBe(HttpStatus.FOUND);
        expect(postByCategory.message).toBe("post found");

        expect(postByCategory).toBeDefined();
        expect(postByCategory.title).toBe(post.title);
        expect(postByCategory.content).toBe(post.content);
        expect(postByCategory.image).toBe(post.image);
        expect(postByCategory.category).toBe(post.category);
        expect(postByCategory.author).toBe(post.author);
      });
  });

  it("Get posts by empty category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_CATEGORY,
        variables: {
          category: "",
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
      });
  });

  it("Get posts by invalid category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_CATEGORY,
        variables: {
          category: `${post.category}invalid`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Category id is invalid");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get posts by author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR,
        variables: {
          author: author._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { postsByAuthor } = res.body.data;

        expect(postsByAuthor.statusCode).toBe(HttpStatus.FOUND);
        expect(postsByAuthor.message).toBe("posts found");

        expect(postsByAuthor).toBeDefined();
        expect(postsByAuthor.length).toBeGreaterThan(0);
      });
  });

  it("Get posts by empty author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR,
        variables: {
          author: "",
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Author id is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get posts by invalid author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR,
        variables: {
          author: `${author._id}invalid`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Author id is invalid");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get posts by author and category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
        variables: {
          author: author._id,
          category: category._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { postsByAuthorAndCategory } = res.body.data;

        expect(postsByAuthorAndCategory.statusCode).toBe(HttpStatus.FOUND);
        expect(postsByAuthorAndCategory.message).toBe("posts found");

        expect(postsByAuthorAndCategory).toBeDefined();
        expect(postsByAuthorAndCategory.length).toBeGreaterThan(0);
      });
  });

  it("Get posts by empty author and category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
        variables: {
          author: "",
          category: category._id,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Author id is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get posts by author and empty category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
        variables: {
          author: author._id,
          category: "",
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
      });
  });

  it("Get posts by invalid author and category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
        variables: {
          author: `${author._id}invalid`,
          category: category._id,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Author id is invalid");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get posts by author and invalid category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_POSTS_BY_AUTHOR_AND_CATEGORY,
        variables: {
          author: author._id,
          category: `${category._id}invalid`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Category id is invalid");
        expect(res.body.data).toBeNull();
      });
  });
});
