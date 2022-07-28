import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { CREATE_USER } from "test/users/users.graphql";
import { CREATE_CATEGORY } from "test/categories/categories.graphql";
import { CreateUserInput } from "../../src/users/dto/create-user.input";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateCategoryInput } from "../../src/categories/dto/create-category.input";
import { HttpStatus, INestApplication } from "@nestjs/common";
import {
  GET_BLOG,
  GET_BLOGS,
  CREATE_BLOG,
  REMOVE_BLOG,
  UPDATE_BLOG,
  GET_BLOG_BY_ID,
  GET_BLOG_BY_SLUG,
  GET_BLOG_BY_TITLE,
  GET_BLOGS_BY_AUTHOR,
  GET_BLOGS_BY_CATEGORY,
  GET_BLOGS_BY_AUTHOR_AND_CATEGORY,
} from "./blogs.graphql";

describe("Blogs (e2e)", () => {
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

  const blog = {
    _id: null,
    title: "Test Blog 1",
    content: "Test Blog Content 1",
    image: "Test Blog Image 1",
    slug: "test-blog-1",
    category: null,
    author: null,
  };

  const category: CreateCategoryInput & { _id: string } = {
    _id: null,
    name: "Test Category 1",
    description: "Test Category Description 1",
  };

  const author: CreateUserInput & { _id: string } = {
    _id: null,
    name: "Test User 1",
    password: "Test User Password 1",
    email: "Test User Email 1",
    avatar: "Test User Image 1",
  };

  it("No query test should have typename", async () => {
    expect(GET_BLOGS.includes("typename")).toBe(false);
    expect(GET_BLOG.includes("typename")).toBe(false);
    expect(GET_BLOG_BY_ID.includes("typename")).toBe(false);
    expect(GET_BLOG_BY_TITLE.includes("typename")).toBe(false);
    expect(GET_BLOG_BY_SLUG.includes("typename")).toBe(false);
    expect(GET_BLOGS_BY_CATEGORY.includes("typename")).toBe(false);
    expect(GET_BLOGS_BY_AUTHOR.includes("typename")).toBe(false);
    expect(GET_BLOGS_BY_AUTHOR_AND_CATEGORY.includes("typename")).toBe(false);
    expect(CREATE_BLOG.includes("typename")).toBe(false);
    expect(UPDATE_BLOG.includes("typename")).toBe(false);
    expect(REMOVE_BLOG.includes("typename")).toBe(false);
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

        blog.category = createCategory._id;
        category._id = createCategory._id;

        expect(blog.category).toBeDefined();
        expect(blog.category).not.toBeNull();
      });

    await server
      .post(path)
      .send({
        query: CREATE_USER,
        variables: {
          name: author.name,
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
        expect(createUser.name).toBe(author.name);
        expect(createUser.password).not.toBe(author.password);
        expect(createUser.email).toBe(author.email);
        expect(createUser.avatar).toBe(author.avatar);

        blog.author = createUser._id;
        author._id = createUser._id;

        expect(blog.author).toBeDefined();
        expect(blog.author).not.toBeNull();
      });
  });

  it("Create a blog", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_BLOG,
        variables: {
          title: blog.title,
          content: blog.content,
          image: blog.image,
          category: blog.category,
          author: blog.author,
        },
      })
      .expect(200)
      .then((res) => {
        const { createBlog } = res.body.data;

        expect(createBlog.statusCode).toBe(HttpStatus.CREATED);
        expect(createBlog.message).toBe("Blog created");

        expect(createBlog).toBeDefined();
        expect(createBlog.title).toBe(blog.title);
        expect(createBlog.content).toBe(blog.content);
        expect(createBlog.image).toBe(blog.image);
        expect(createBlog.category).toBe(blog.category);
        expect(createBlog.author).toBe(blog.author);

        blog._id = createBlog._id;
        blog.slug = createBlog.slug;

        expect(blog._id).toBeDefined();
        expect(blog._id).not.toBeNull();
      });
  });

  it("Create a blog with invalid category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_BLOG,
        variables: {
          title: blog.title,
          content: blog.content,
          image: blog.image,
          category: "invalid",
          author: blog.author,
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

  it("Create a blog with invalid author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: CREATE_BLOG,
        variables: {
          title: blog.title,
          content: blog.content,
          image: blog.image,
          category: blog.category,
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

  it("Get all blogs", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS,
      })
      .expect(200)
      .then((res) => {
        const { blogs } = res.body.data;

        expect(blogs.statusCode).toBe(HttpStatus.FOUND);
        expect(blogs.message).toBe("Blogs found");

        expect(blogs).toBeDefined();
        expect(blogs.length).toBeGreaterThan(0);
      });
  });

  it("Get a blog by id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_ID,
        variables: {
          id: blog._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { blog } = res.body.data;

        expect(blog.statusCode).toBe(HttpStatus.FOUND);
        expect(blog.message).toBe("Blog found");

        expect(blog).toBeDefined();
        expect(blog.title).toBe(blog.title);
        expect(blog.description).toBe(blog.description);
        expect(blog.content).toBe(blog.content);
        expect(blog.image).toBe(blog.image);
        expect(blog.category).toBe(blog.category);
        expect(blog.author).toBe(blog.author);
      });
  });

  it("Get a blog by empty id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_ID,
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
        expect(error.message).toBe("Blog id is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a blog by invalid id", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_ID,
        variables: {
          id: `${blog._id}invalid`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Blog id is invalid");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a blog by title", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_TITLE,
        variables: {
          title: blog.title,
        },
      })
      .expect(200)
      .then((res) => {
        const { blogByTitle } = res.body.data;

        expect(blogByTitle.statusCode).toBe(HttpStatus.FOUND);
        expect(blogByTitle.message).toBe("Blog found");

        expect(blogByTitle).toBeDefined();
        expect(blogByTitle.title).toBe(blog.title);
        expect(blogByTitle.content).toBe(blog.content);
        expect(blogByTitle.image).toBe(blog.image);
        expect(blogByTitle.category).toBe(blog.category);
        expect(blogByTitle.author).toBe(blog.author);
      });
  });

  it("Get a blog by empty title", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_TITLE,
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
        expect(error.message).toBe("Blog title is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a blog by invalid title", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_TITLE,
        variables: {
          title: blog.title,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(
          HttpStatus.BAD_REQUEST,
        );
        expect(error.message).toBe("Blog title is invalid");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a blog by slug", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_SLUG,
        variables: {
          slug: blog.slug,
        },
      })
      .expect(200)
      .then((res) => {
        const { blogBySlug } = res.body.data;

        expect(blogBySlug.statusCode).toBe(HttpStatus.FOUND);
        expect(blogBySlug.message).toBe("Blog found");

        expect(blogBySlug).toBeDefined();
        expect(blogBySlug.title).toBe(blog.title);
        expect(blogBySlug.content).toBe(blog.content);
        expect(blogBySlug.image).toBe(blog.image);
        expect(blogBySlug.category).toBe(blog.category);
        expect(blogBySlug.author).toBe(blog.author);
      });
  });

  it("Get a blog by empty slug", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_SLUG,
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
        expect(error.message).toBe("Blog slug is required");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get a blog by invalid slug", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOG_BY_SLUG,
        variables: {
          slug: `${blog.slug}invalid`,
        },
      })
      .expect(200)
      .then((res) => {
        const error = res.body.errors[0];

        expect(error.extensions.response.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe("Blog not found");
        expect(res.body.data).toBeNull();
      });
  });

  it("Get blogs by category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_CATEGORY,
        variables: {
          category: blog.category,
        },
      })
      .expect(200)
      .then((res) => {
        const { blogByCategory } = res.body.data;

        expect(blogByCategory.statusCode).toBe(HttpStatus.FOUND);
        expect(blogByCategory.message).toBe("Blog found");

        expect(blogByCategory).toBeDefined();
        expect(blogByCategory.title).toBe(blog.title);
        expect(blogByCategory.content).toBe(blog.content);
        expect(blogByCategory.image).toBe(blog.image);
        expect(blogByCategory.category).toBe(blog.category);
        expect(blogByCategory.author).toBe(blog.author);
      });
  });

  it("Get blogs by empty category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_CATEGORY,
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

  it("Get blogs by invalid category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_CATEGORY,
        variables: {
          category: `${blog.category}invalid`,
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

  it("Get blogs by author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR,
        variables: {
          author: author._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { blogsByAuthor } = res.body.data;

        expect(blogsByAuthor.statusCode).toBe(HttpStatus.FOUND);
        expect(blogsByAuthor.message).toBe("Blogs found");

        expect(blogsByAuthor).toBeDefined();
        expect(blogsByAuthor.length).toBeGreaterThan(0);
      });
  });

  it("Get blogs by empty author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR,
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

  it("Get blogs by invalid author", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR,
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

  it("Get blogs by author and category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR_AND_CATEGORY,
        variables: {
          author: author._id,
          category: category._id,
        },
      })
      .expect(200)
      .then((res) => {
        const { blogsByAuthorAndCategory } = res.body.data;

        expect(blogsByAuthorAndCategory.statusCode).toBe(HttpStatus.FOUND);
        expect(blogsByAuthorAndCategory.message).toBe("Blogs found");

        expect(blogsByAuthorAndCategory).toBeDefined();
        expect(blogsByAuthorAndCategory.length).toBeGreaterThan(0);
      });
  });

  it("Get blogs by empty author and category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR_AND_CATEGORY,
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

  it("Get blogs by author and empty category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR_AND_CATEGORY,
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

  it("Get blogs by invalid author and category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR_AND_CATEGORY,
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

  it("Get blogs by author and invalid category", async () => {
    await request(app.getHttpServer())
      .post(path)
      .send({
        query: GET_BLOGS_BY_AUTHOR_AND_CATEGORY,
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
