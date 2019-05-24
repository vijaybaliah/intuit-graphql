import gql from 'graphql-tag'

export const BUILDINGS_LIST = gql`
  query Buildings {
    Buildings {
      id
      name
      meetingRooms {
        id
      }
    }
  }
`

export const MEETING = gql`
  query Meetings {
    Meetings {
      title
      date
      startTime
      endTime
    }
  }
`

export const MEETING_ROOM_LIST = gql`
  query MeetingRoomsList($buildingId: Int!) {
    Building(id: $buildingId) {
      id
      name
      meetingRooms {
        id
        name
        floor
        meetings {
          title
          date
          startTime
          endTime
        }
      }
    }
  }
`

export const ADD_MEETING = gql`
  mutation AddMeeting($title: String!, $date: String!, $startTime: String!, $endTime: String!, $meetingRoomId: Int!, $id: Int!) {
    Meeting(
      id: $id
      title: $title
      date: $date
      startTime: $startTime
      endTime: $endTime
      meetingRoomId: $meetingRoomId
    ) {
      id
      title
    }
  }
`