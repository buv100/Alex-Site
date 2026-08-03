import { Schema, models, model, type InferSchemaType, Types } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: null },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    privacyConsentAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: Types.ObjectId;
};

export const UserModel = models.User || model("User", UserSchema);
