export const MAIN_NAMESPACE_EVENTS = {
  ACTIVE_ROOMS: "active::rooms",
  SEND_MESSAGE: "send::message",
  NEW_MESSAGE: "new::message",
};

export const ROOM_NAMESPACE_EVENTS = {
  JOIN_ROOM: "join::room",
  LEAVE_ROOM: "leave::room",
  NEW_PLAYER_JOINED: "player::joined",
  PLAYER_DISCONNECTED: "player::disconnected",
  SEND_MESSAGE: "send::message",
  NEW_MESSAGE: "new::message",
  JOIN_REQUEST: "join::request",
  JOIN_REQUEST_RESPONSE: "join::request::response",
  JOIN_REQUEST_ACCEPTED: "join::request::accepted",
  START_GAME: "start::game",
  END_GAME: "end::game",
  RESTART_GAME: "restart::game",
};
