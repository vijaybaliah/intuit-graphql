import gql from 'graphql-tag'

export const BUILDINGS_LIST = gql`
  {
    Buildings {
      id
      name
    }
  }
`