export const toPublicJsonTransform = (doc, ret) => {
  ret.$id = String(ret._id);
  delete ret._id;
  delete ret.__v;
  return ret;
};

