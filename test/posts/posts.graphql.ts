/**
 *
 * Fragments
 *
 */
export const FRAGMENT_POST = `
    fragment Post on PostEntity {
        id
        title
        body
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

export const GET_POST_BY_TITLE = ``;

export const GET_POST_BY_SLUG = `
    ${FRAGMENT_RESPONSE_POST}
    query GET_POST_BY_SLUG($slug: String!) {
        postBySlug(slug: $slug) {
            ...ResponsePost
        }
    }
`;

export const GET_POSTS_BY_CATEGORY = ``;
export const GET_POSTS_BY_AUTHOR = ``;
export const GET_POSTS_BY_AUTHOR_AND_CATEGORY = ``;

/**
 *
 * Mutations
 *
 */
export const CREATE_POST = ``;
export const UPDATE_POST = ``;
export const REMOVE_POST = ``;
