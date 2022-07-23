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
          message
          statusCode
          data {
            ...Category
          }
        }
    }
`;

export const GET_CATEGORY_BY_ID = `
    ${FRAGMENT_CATEGORY}
    query GET_CATEGORY_BY_ID($id: String!) {
        categoryById(id: $id) {
          message
          statusCode
          data {
            ...Category
          }
        }
    }
`;

export const GET_CATEGORY_BY_NAME = `
    ${FRAGMENT_CATEGORY}
    query GET_CATEGORY_BY_NAME($name: String!) {
        categoryByName(name: $name) {
          message
          statusCode
          data {
            ...Category
          }
        }
    }
`;

/**
 * MUTATIONS
 */
export const CREATE_CATEGORY = `
    ${FRAGMENT_CATEGORY}
    mutation CREATE_CATEGORY($name: String!, $description: String) {
        createCategory(input: { name: $name, description: $description }) {
          statusCode
          message
          data {
            ...Category
          }
        }
    }
`;

export const UPDATE_CATEGORY = `
  ${FRAGMENT_CATEGORY}
  mutation UPDATE_CATEGORY($id: String!, $name: String, $description: String) {
    updateCategory(input: {
      id: $id,
      name: $name,
      description: $description
    }) {
      statusCode
      message
      data {
        ...Category
      }
    }
  }
`;

export const REMOVE_CATEGORY = `
  ${FRAGMENT_CATEGORY}
  mutation REMOVE_CATEGORY($id: String!) {
    removeCategory(id: $id) {
      statusCode
      message
      data {
        ...Category
      }
    }
  }
`;
