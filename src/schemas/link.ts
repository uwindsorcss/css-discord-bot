import { model, Schema, Types } from "mongoose";

export interface Link {
    _id: string,
    name: string,
    url: string,
}

const linkSchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
});
export const linkModel = model<Link>('Link', linkSchema);
