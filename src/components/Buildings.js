import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { BUILDINGS_LIST, MEETING } from '../GraphqlTags'
import { withStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import { getMomentDate } from '../utils/helpers'
import moment from 'moment'
import Modal from '@material-ui/core/Modal'
import { isEmpty } from '../utils/validations'

const styles = theme => ({
  builingsInfo: {
    display: 'flex',
    justifyContent: 'center',
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit * 1,
  },
  errorPopup: {
    backgroundColor: theme.palette.error.light,
    padding: theme.spacing.unit * 1
  },
  errorMessage: {
    color: 'white'
  },
  selectField: {
    width: 200
  },
});

class Buildings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      buildingId: -1,
      totalRooms: 0,
      onGoing: 0,
      freeNow: 0,
      today: 0,
      error: ''
    }
  }

  handleBuildingChange = (e) => {
    this.setState({
      buildingId: e.target.value
    })
  }

  onFetchBuildingList = (data) => {
    let totalRooms = 0
    // eslint-disable-next-line
    data.Buildings.map(building => {
      totalRooms += building.meetingRooms.length
    })
    this.setState({ totalRooms })
  }

  onFetchMeetingsSuccess = (data) => {
    let today = 0
    let onGoing = 0
    const { totalRooms } = this.state
    // eslint-disable-next-line
    data.Meetings.map(meeting => {
      const startDate = getMomentDate(meeting.date + " " + meeting.startTime)
      const endDate = getMomentDate(meeting.date + " " + meeting.endTime)
      const currentDate = moment()
      if (currentDate.isBetween(startDate, endDate)) {
        onGoing += 1
      }
      if (currentDate.isSame(startDate, 'day') || currentDate.isSame(endDate, 'day')) {
        today += 1
      }
    })
    this.setState({
      today,
      onGoing,
      freeNow: totalRooms - onGoing
    })
  }

  validateAddMeeting = () => {
    const { buildingId } = this.state
    if (buildingId > -1) {
      this.props.history.push(`/add-meeting/${buildingId}`)
    } else {
      this.setState({ error: 'Kindly select any meeting rooms' })
    }
  }

  handleCloseModal = () => {
    this.setState({ error: '' })
  }

  render() {
    const { classes } = this.props
    const { error } = this.state
    return (
      <>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={!isEmpty(error)}
          onClose={this.handleCloseModal}
        >
          <div className={classes.errorPopup}>
            <p className={classes.errorMessage}>{error}</p>
          </div>
        </Modal>
        <div className={classes.builingsInfo}>
          <div>
            <Query query={BUILDINGS_LIST} onCompleted={this.onFetchBuildingList}>
              {
                ({ loading, data, error }) => {
                  if (loading) return <div>Loading</div>
                  if (error) return <div>{error.toString()}</div>

                  return (
                    <form className={classes.root}>
                      <FormControl>
                        <InputLabel htmlFor={'buildings'}>Select Buildings</InputLabel>
                        <Select
                          value={this.state.buildingId}
                          onChange={this.handleBuildingChange}
                          className={classes.selectField}
                          inputProps={{
                            name: 'buildingId',
                            id: 'buildings',
                          }}
                        >
                          <MenuItem value={-1}>
                            <em>None</em>
                          </MenuItem>
                          {
                            data.Buildings.map(building => <MenuItem key={building.id} value={building.id}>{building.name}</MenuItem>)
                          }
                        </Select>
                      </FormControl>
                    </form>
                  )
                }
              }
            </Query>
            <Query query={MEETING} onCompleted={this.onFetchMeetingsSuccess}>
              {
                ({ loading, data, error }) => {
                  if (loading) return <div>Loading</div>
                  if (error) return <div>{error.toString()}</div>
                  const { onGoing, freeNow , today, totalRooms } = this.state
                  return(
                    <>
                      <div>
                        <p>Rooms</p>
                        <p>{`Total ${totalRooms}`}</p>
                        <p>{`Free Now ${freeNow}`}</p>
                      </div>
                      <div>
                        <p>Meetings</p>
                        <p>{`Total ${today} Today`}</p>
                        <p>{`Total ${onGoing} Going on now`}</p>
                      </div>
                    </>
                  )
                }
              }
            </Query>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.validateAddMeeting}
            >
              Add Meeting
            </Button>
          </div>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(Buildings)