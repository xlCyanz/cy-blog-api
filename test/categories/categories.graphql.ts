/**
 * FRAGMENTS
 */
const FRAGMENT_CATEGORY = `
    fragment Category on Category {
        _id
        name
        description
    }
`;

/**
 * QUERIES
 */
export const GET_ALL_CATEGORIES = `
    ${FRAGMENT_CATEGORY}
    query GET_ALL_CATEGORIES {
        categories {
            __typename
            ...Category
        }
    }
`;

export const GET_CATEGORY_BY_ID = `
    ${FRAGMENT_CATEGORY}
    query GET_CATEGORY_BY_ID($id: String!) {
        categoryById(id: $id) {
            __typename
            ...Category
        }
    }
`;

export const GET_CATEGORY_BY_NAME = `
    ${FRAGMENT_CATEGORY}
    query GET_CATEGORY_BY_NAME($name: String!) {
        categoryByName(name: $name) {
            __typename
            ...Category
        }
    }
`;

/**
 * MUTATIONS
 */
export const CREATE_CATEGORY = `
    ${FRAGMENT_CATEGORY}
    mutation CREATE_CATEGORY($input: CreateCategoryInput!) {
        createCategory(input: $input) {
            __typename
            ...Category
        }
    }
`;
