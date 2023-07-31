import { FRAGMENT_USER } from "../users/users.graphql";
import { FRAGMENT_CATEGORY } from "../categories/categories.graphql";

/**
 *
 * Fragments
 *
 */
export const FRAGMENT_POST = `
    fragment Post on PostEntity {
        id
        title
        content
        image
        slug
        published
        authorId
        categoryId
        createdAt
        updatedAt
    }
`;

export const FRAGMENT_RESPONSE_POST = `
    ${FRAGMENT_POST}
    fragment ResponsePost on ResponsePost {
        statusCode
        messageCode
        data {
            ...Post
        }
    }
`;

export const FRAGMENT_RESPONSE_POSTS = `
    ${FRAGMENT_POST}
    fragment ResponsePosts on ResponsePosts {
        statusCode
        messageCode
        data {
            ...Post
        }
    }
`;

/**
 *
 * Queries
 *
 */
export const GET_POSTS = `
    ${FRAGMENT_RESPONSE_POSTS}
    query GET_POSTS {
        posts {
            ...ResponsePosts
        }
    }
`;

export const GET_POST_BY_ID = `
    ${FRAGMENT_RESPONSE_POST}
    query GET_POST($id: Int!) {
        post(id: $id) {
            ...ResponsePost
        }
    }
`;

export const GET_POSTS_BY_TITLE = `
    ${FRAGMENT_RESPONSE_POSTS}
    query GET_POSTS_BY_TITLE($title: String!) {
        postsByTitle(title: $title) {
            ...ResponsePosts
        }
    }
`;

export const GET_POST_BY_TITLE = `
${FRAGMENT_RESPONSE_POSTS}
query GET_POSTS_BY_TITLE($title: String!) {
  postsByTitle(title: $title) {
    ...ResponsePosts
  }
}
`;

export const GET_POST_BY_SLUG = `
${FRAGMENT_RESPONSE_POST}
query GET_POST_BY_SLUG($slug: String!) {
  postBySlug(slug: $slug) {
    ...ResponsePost
  }
}
`;

export const GET_POSTS_BY_CATEGORY = `
${FRAGMENT_RESPONSE_POSTS}
query GET_POSTS_BY_CATEGORY($categoryId: Float!) {
  postsByCategory(categoryId: $categoryId) {
    ...ResponsePosts
  }
}
`;

export const GET_POSTS_BY_AUTHOR = ``;

export const GET_POSTS_BY_AUTHOR_AND_CATEGORY = ``;

/**
 *
 * Mutations
 *
 */
export const CREATE_POST = `
${FRAGMENT_POST}
${FRAGMENT_USER}
${FRAGMENT_CATEGORY}
mutation CREATE_POST($input: CreatePostInput!) {
  createPost(input: $input) {
    statusCode
    messageCode
    data {
      ...Post
      author {
        ...User
      }
      category {
        ...Category
      }
    }
  }
}
`;

export const PUBLISH_POST = `
${FRAGMENT_POST}
mutation PUBLISH_POST($id: Float!) {
  publishPost(id: $id) {
    statusCode
    messageCode
    data {
      ...Post
    }
  }
}
`;

export const UPDATE_POST = ``;
export const REMOVE_POST = ``;
