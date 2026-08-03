import { Schema, models, model, type InferSchemaType, Types } from "mongoose";

const LeadSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["property", "general", "seller"],
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: null },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", default: null },
    propertyTitle: { type: String, default: null },
    propertyUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
    },
    privacyConsentAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export type LeadDocument = InferSchemaType<typeof LeadSchema> & {
  _id: Types.ObjectId;
};

export const LeadModel = models.Lead || model("Lead", LeadSchema);
