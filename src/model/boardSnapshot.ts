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

export class BoardSnapshot extends Model<
  InferAttributes<BoardSnapshot>,
  InferCreationAttributes<BoardSnapshot>
> {
  declare id: CreationOptional<number>;
  declare roomId: ForeignKey<Room["id"]>;
  declare elements: object[];
  declare appState: object | null;
  declare updatedBy: ForeignKey<User["id"]> | null;
}

BoardSnapshot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    elements: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    appState: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "BoardSnapshot",
    tableName: "board_snapshots",
  }
);
