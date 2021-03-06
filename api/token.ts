import { NowRequest, NowResponse } from '@vercel/node';
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const fourHours = 14400;
const MAX_ALLOWED_SESSION_DURATION = fourHours;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const client = require('twilio')(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid });

const createRoom = async (roomName: string | string[]) => {
  try {
    const currentRoom = await client.video.rooms(roomName).fetch();
    console.log('Room Exists', currentRoom);
  } catch (err) {
    console.log(err);
    if (err.status === 404) {
      // room does not exist, so create it.
      const room = await client.video.rooms.create({
        recordParticipantsOnConnect: true,
        statusCallback: 'https://a.deephire.com/v1/live/events',
        type: 'group-small',
        uniqueName: roomName,
      });
      console.log('room created', room);
    }
  }
};
interface QueryInterface {
  roomName: string;
  identity: string;
}
export default (request: NowRequest, response: NowResponse) => {
  const { identity, roomName } = request.query
  createRoom(roomName);
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  response.status(200).send(token.toJwt());
};
