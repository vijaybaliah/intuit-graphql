import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Buildings from './Buildings'
import AddMeeting from './AddMeeting'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Buildings} />
        <Route exact path="/add-meeting/:buildingId" component={AddMeeting} />
      </Switch>
    )
  }
}

export default App