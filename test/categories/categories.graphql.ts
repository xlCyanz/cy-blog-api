/**
 * Fragments
 */
export const FRAGMENT_CATEGORY = `
fragment Category on CategoryEntity {
  id
  name
  description
}
`;

const FRAGMENT_RESPONSE_CATEGORY = `
${FRAGMENT_CATEGORY}
fragment ResponseCategory on ResponseCategory {
  messageCode
  statusCode
  data {
    ...Category
  }
}
`;

const FRAGMENT_RESPONSE_CATEGORIES = `
${FRAGMENT_CATEGORY}
fragment ResponseCategories on ResponseCategories {
  messageCode
  statusCode
  data {
    ...Category
  }
}
`;

/**
 * Queries
 */
export const GET_ALL_CATEGORIES = `
${FRAGMENT_RESPONSE_CATEGORIES}
query GET_ALL_CATEGORIES {
  categories {
    ...ResponseCategories
  }
}
`;

export const GET_CATEGORY_BY_ID = `
${FRAGMENT_RESPONSE_CATEGORY}
query GET_CATEGORY_BY_ID($id: Float!) {
  categoryById(id: $id) {
    ...ResponseCategory
  }
}
`;

export const GET_CATEGORY_BY_NAME = `
${FRAGMENT_RESPONSE_CATEGORY}
query GET_CATEGORY_BY_NAME($name: String!) {
  categoryByName(name: $name) {
    ...ResponseCategory
  }
}
`;

/**
 * Mutations
 */
export const CREATE_CATEGORY = `
${FRAGMENT_RESPONSE_CATEGORY}
mutation CREATE_CATEGORY($name: String!, $description: String) {
  createCategory(input: { name: $name, description: $description }) {
    ...ResponseCategory
  }
}
`;

export const UPDATE_CATEGORY = `
${FRAGMENT_RESPONSE_CATEGORY}
mutation UPDATE_CATEGORY($id: Float!, $name: String, $description: String) {
  updateCategory(input: { id: $id, name: $name, description: $description }) {
    ...ResponseCategory
  }
}
`;

export const REMOVE_CATEGORY = `
${FRAGMENT_RESPONSE_CATEGORY}
mutation REMOVE_CATEGORY($id: Float!) {
  removeCategory(id: $id) {
    ...ResponseCategory
  }
}
`;
