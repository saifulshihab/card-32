export const MAIN_SOCKET_EVENTS = {
  "ACTIVE::ROOMS": "active::rooms",
  "NEW::ROOM": "new::room",
  "ROOM::DELETED": "room::deleted",
  "CHECK::PLAYER": "check::player",
};

export const ROOM_SOCKET_EVENTS = {
  "PLAYER::JOINED": "player::joined",
  "UPDATE::ROOM": "update::room",
  "ROOM::PLAYERS": "room::players",
  "PLAYER::LEAVE": "player::leave",
  "START::GAME": "start::game",
};
