import { gql } from '@apollo/client';

export const GET_TODO_LIST = gql`
  query todoList($filter: ItemFilter) {
    todoList(filter: $filter) {
      id
      name
    }
  }
`;

export const ADD_ITEM_MUTATION = gql`
  mutation addItem($values: ItemInput) {
    addItem(values: $values)
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItem($values: ItemInput!) {
    updateItem(values: $values)
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItem($id: Int!) {
    deleteItem(id: $id)
  }
`;
