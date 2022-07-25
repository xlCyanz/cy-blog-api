/**
 *
 * Fragments
 *
 */
export const FRAGMENT_USER = `
fragment User on User {
  _id
  name
  email
  password
  avatar
  role
}
`;

export const FRAGMENT_RESPONSE_USER = `
${FRAGMENT_USER}
fragment ResponseUser on ResponseUser {
  statusCode
  message
  data {
    ...User
  }
}
`;

/**
 *
 * Queries
 *
 */
export const GET_USER_BY_ID = `
${FRAGMENT_RESPONSE_USER}
query GET_USER_BY_ID($id: String!) {
  user(id: $id) {
    ...ResponseUser
  }
}
`;

export const GET_USER_BY_NAME = `
${FRAGMENT_RESPONSE_USER}
query GET_USER_BY_NAME($name: String!) {
  userByName(name: $name) {
    ...ResponseUser
  }
}
`;

export const GET_USER_BY_EMAIL = `
${FRAGMENT_RESPONSE_USER}
query GET_USER_BY_EMAIL($email: String!) {
  userByEmail(email: $email) {
    ...ResponseUser
  }
}
`;

/**
 *
 * Mutations
 *
 */
export const CREATE_USER = `
${FRAGMENT_RESPONSE_USER}
mutation CREATE_USER($input: CreateUserInput!) {
  createUser(input: $input) {
    ...ResponseUser
  }
}
`;

export const UPDATE_USER = `
${FRAGMENT_RESPONSE_USER}
mutation UPDATE_USER($input: UpdateUserInput!) {
  updateUser(input: $input) {
    ...ResponseUser
  }
}
`;

export const REMOVE_USER = `
${FRAGMENT_RESPONSE_USER}
mutation REMOVE_USER($id: String!) {
  removeUser(id: $id) {
    ...ResponseUser
  }
}
`;

export const LOGIN_USER = ``;
export const LOGIN_REGISTER = ``;
