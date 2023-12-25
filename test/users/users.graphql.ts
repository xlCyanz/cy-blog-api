/**
 *
 * Fragments
 *
 */
export const FRAGMENT_USER = `
fragment User on UserEntity {
  id
  firstName
  lastName
  email
  createdAt
  updatedAt
}
`;

export const FRAGMENT_RESPONSE_USER = `
  ${FRAGMENT_USER}
  fragment ResponseUser on ResponseUser {
    statusCode
    messageCode
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
export const GET_USER_ME = `
  ${FRAGMENT_RESPONSE_USER}
  query GET_USER_ME {
    me {
      statusCode
      messageCode
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
  mutation REMOVE_USER($id: Float!) {
    removeUser(id: $id) {
      ...ResponseUser
    }
  }
`;

export const LOGIN_USER = ``;
export const LOGIN_REGISTER = ``;
