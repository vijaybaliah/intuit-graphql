import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import { MEETING_ROOM_LIST, ADD_MEETING } from '../GraphqlTags'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { getMomentDate } from '../utils/helpers'
import Modal from '@material-ui/core/Modal'

const styles = theme => ({
  addMeetingForm: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit * 1,
    marginRight: theme.spacing.unit * 1,
    width: 200,
  },
  meetingsPopup: {
    backgroundColor: 'white'
  },
  meetings: {
    border: 'thin solid'
  },
})

class AddMeeting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      meetingRooms: [],
      availabeRooms: [],
      buildingName: '',
      open: false
    }
  }

  handleInput = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  comuteAvailableRooms = () => {
    const { date, startTime, endTime, title, meetingRooms, buildingName } = this.state
    const reqStartDate = getMomentDate(date + " " + startTime)
    const reqEndDate = getMomentDate(date + " " + endTime)
    const availabeRooms = []
    meetingRooms.map(room => {
      for(let i=0; i <room.meetings.length; i++) {
        const meeting = room.meetings[i]
        const roomStartDate = getMomentDate(meeting.date + " " + meeting.startTime)
        const roomEndDate = getMomentDate(meeting.date + " " + meeting.endTime)
        if(!reqStartDate.isBetween(roomStartDate, roomEndDate) && !reqEndDate.isBetween(roomStartDate, roomEndDate)) {
          availabeRooms.push({
            meetingRoomId: room.id,
            id: Math.floor(Math.random() * 100),
            title,
            date,
            startTime,
            endTime,
            buildingName,
            floor: room.floor
          })
          break;
        }
      }
    })
    return availabeRooms
  }

  updateMeetingRooms = (data) => {
    this.setState({
      meetingRooms: data.Building.meetingRooms,
      buildingName: data.Building.name
    })
  }

  handleFormSubmit = (submitForm) => {
    const availabeRooms = this.comuteAvailableRooms()
    if (availabeRooms.length > 0) {
      this.setState({ availabeRooms, open: true })
    }
    
    console.log('availabeRooms: ', availabeRooms)
  }

  handleCloseModal = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes, match: { params } } = this.props
    const { date, startTime, endTime, title, open, availabeRooms, meetingRooms } = this.state
    console.log('meetingRooms: ', meetingRooms)
    return (
      <>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={this.handleCloseModal}
        >
          <div className={classes.meetingsPopup}>
            {
              availabeRooms.map(room => {
                return (
                  <div key={room.meetingRoomId} className={classes.meetings}>
                    <Mutation
                      mutation={ADD_MEETING}
                      variables={{...room}}
                      onCompleted={this.handleCloseModal}>
                    {
                      (submitForm, {loading, error}) => {
                        return(
                          <div onClick={submitForm}>
                            <p>{room.title}</p>
                            <p>{room.buildingName}</p>
                            <p>{room.floor}</p>
                          </div> 
                        )
                      }
                    }
                    </Mutation>
                </div>
               )
              })
            }
          </div>
        </Modal>
        <div className={classes.addMeetingForm}>
          <form autoComplete="off">
            <Query query={MEETING_ROOM_LIST} variables={{buildingId: parseInt(params.buildingId)}} onCompleted={this.updateMeetingRooms}>
              {
                ({ loading, data, error }) => {
                  if (loading) return <div>Loading</div>
                  if (error) return <div>{error.toString()}</div>
                  return (
                    <>
                      <div>
                        <TextField
                          id="title"
                          label="Title"
                          className={classes.textField}
                          value={title}
                          name="title"
                          onChange={this.handleInput}
                          margin="normal"
                        />
                      </div>
                      <div>
                        <TextField
                          id="date"
                          label="Date"
                          className={classes.textField}
                          value={date}
                          name="date"
                          onChange={this.handleInput}
                          margin="normal"
                        />
                      </div>
                      <div>
                        <TextField
                          id="startTime"
                          label="Start Time"
                          className={classes.textField}
                          value={startTime}
                          name="startTime"
                          onChange={this.handleInput}
                          margin="normal"
                        />
                      </div>
                      <div>
                        <TextField
                          id="endTime"
                          label="End Time"
                          className={classes.textField}
                          value={endTime}
                          name="endTime"
                          onChange={this.handleInput}
                          margin="normal"
                        />
                      </div>
                    </>
                  )
                }
              }

            </Query>
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleFormSubmit}
            >
              Next
            </Button>
          </form>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(AddMeeting)