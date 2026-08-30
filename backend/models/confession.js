import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  tag: { type: String, default: "Campus" },
  likes: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ts: { type: Number, default: () => Date.now() },
}, { timestamps: true });

confessionSchema.virtual("id").get(function () {
  return this._id.toString();
});

confessionSchema.set("toJSON", {
  virtuals: true,
  transform: function (_doc, ret) {
    if (ret.createdBy && typeof ret.createdBy !== "string") {
      ret.createdBy = ret.createdBy.toString();
    }
    return ret;
  },
});

export default mongoose.model("Confession", confessionSchema);
