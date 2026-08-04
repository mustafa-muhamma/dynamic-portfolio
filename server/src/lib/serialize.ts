type ApiDoc<T> = Omit<T, "_id"> & { id: string };

export function toApiDoc<T extends object>(doc: T & { _id: unknown }): ApiDoc<T> {
  const { _id, ...rest } = doc;
  return { id: String(_id), ...rest } as ApiDoc<T>;
}
