import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user";

export class Room extends Model<
  InferAttributes<Room>,
  InferCreationAttributes<Room>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare ownerId: ForeignKey<User["id"]>;
  declare isPrivate: CreationOptional<boolean>;
}

Room.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Room",
    tableName: "rooms",
  }
);
