import { BoardSnapshot } from "./boardSnapshot";
import { Room } from "./room";
import { RoomParticipant } from "./roomParticipant";
import { User } from "./user";

let initialized = false;

export const initModels = () => {
  if (initialized) return;

  User.hasMany(Room, { foreignKey: "ownerId", as: "ownedRooms" });
  Room.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

  Room.hasMany(RoomParticipant, { foreignKey: "roomId", as: "participants" });
  RoomParticipant.belongsTo(Room, { foreignKey: "roomId", as: "room" });

  User.hasMany(RoomParticipant, { foreignKey: "userId", as: "memberships" });
  RoomParticipant.belongsTo(User, { foreignKey: "userId", as: "user" });

  Room.hasOne(BoardSnapshot, { foreignKey: "roomId", as: "snapshot" });
  BoardSnapshot.belongsTo(Room, { foreignKey: "roomId", as: "room" });

  User.hasMany(BoardSnapshot, { foreignKey: "updatedBy", as: "updatedBoards" });
  BoardSnapshot.belongsTo(User, { foreignKey: "updatedBy", as: "updatedByUser" });

  initialized = true;
};

export { User, Room, RoomParticipant, BoardSnapshot };
