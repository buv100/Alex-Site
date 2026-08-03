import { Schema, models, model, type InferSchemaType, Types } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const PropertySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dealType: { type: String, enum: ["sale", "rent"], required: true },
    propertyType: {
      type: String,
      enum: ["apartment", "penthouse", "duplex", "garden", "studio", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "sold", "rented"],
      default: "draft",
    },
    price: { type: Number, default: null },
    currency: { type: String, default: "ILS" },
    rooms: { type: Number, required: true },
    sizeSqm: { type: Number, default: null },
    floor: { type: Number, default: null },
    totalFloors: { type: Number, default: null },
    hasElevator: { type: Boolean, default: false },
    hasParking: { type: Boolean, default: false },
    hasBalcony: { type: Boolean, default: false },
    direction: { type: String, default: null },
    city: { type: String, default: "ירושלים" },
    neighborhood: { type: String, default: "" },
    street: { type: String, default: null },
    arnona: { type: Number, default: null },
    vaadBayit: { type: Number, default: null },
    areaPopulationNotes: { type: String, default: null },
    isOpportunity: { type: Boolean, default: false },
    isExclusive: { type: Boolean, default: false },
    images: { type: [ImageSchema], default: [] },
    publishedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    ownerName: { type: String, default: null },
    ownerPhone: { type: String, default: null },
    ownerNotes: { type: String, default: null },
    minPriceNegotiable: { type: Number, default: null },
    internalNotes: { type: String, default: null },
    exactAddress: { type: String, default: null },
  },
  { timestamps: true },
);

export type PropertyDocument = InferSchemaType<typeof PropertySchema> & {
  _id: Types.ObjectId;
};

export const PropertyModel =
  models.Property || model("Property", PropertySchema);
