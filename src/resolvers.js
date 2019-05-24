import gql from 'graphql-tag'

// export const typeDefs = gql`
//   extend type Query {
//     ongoingRooms(totalRooms: Int!): [Meeting!]!
//   }
// `;

// const rooms = [{id: 5, name: 'vijay', __typename: 'ongoingRoom'}]
// export const resolvers = {
//   Query: {
//     ongoingRooms: (parent, args) => {
//       console.log('totalRoomsppp: ', args)
//       const meetings = parent.MeetingRooms.map(meetingRooms => {
//         return meetingRooms.meetings
//       })
//       console.log('meetings: ', meetings)
//       return (meetings)
//     }
//   }
// }