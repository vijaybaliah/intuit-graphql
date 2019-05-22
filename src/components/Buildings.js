import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { BUILDINGS_LIST } from './queries'

class Buildings extends Component {

  render() {
    return (
      <Query query={BUILDINGS_LIST}>
        {
          ({ loading, data, error }) => {
            if (loading) return <div>Loading</div>
            if (error) return <div>{error.toString()}</div>

            return (
              <div>
                {
                  data.Buildings.map(building => <div key={building.id}>{building.name}</div>)
                }
              </div>
            )
          }
        }
      </Query>
    )
  }
}
export default Buildings