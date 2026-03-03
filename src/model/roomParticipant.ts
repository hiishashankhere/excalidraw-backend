import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import { Room } from "./room";
import { User } from "./user";

export class RoomParticipant extends Model<
  InferAttributes<RoomParticipant>,
  InferCreationAttributes<RoomParticipant>
> {
  declare id: CreationOptional<number>;
  declare roomId: ForeignKey<Room["id"]>;
  declare userId: ForeignKey<User["id"]> | null;
  declare socketId: string;
  declare displayName: string;
  declare role: CreationOptional<"owner" | "editor" | "viewer">;
  declare lastSeenAt: CreationOptional<Date>;
}

RoomParticipant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("owner", "editor", "viewer"),
      allowNull: false,
      defaultValue: "editor",
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "RoomParticipant",
    tableName: "room_participants",
  }
);
