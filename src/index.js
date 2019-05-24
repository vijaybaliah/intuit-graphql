import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker';

// 1
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { BrowserRouter } from 'react-router-dom'

// 2
const httpLink = createHttpLink({
  uri: 'http://smart-meeting.herokuapp.com'
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: "a123gjhgjsdf4577"
    }
  }
})

const cache = new InMemoryCache()


// 3
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
  connectToDevTools: true
})

cache.writeData({
  data: {
    availableRooms: [],
  },
})
// 4
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
serviceWorker.unregister();