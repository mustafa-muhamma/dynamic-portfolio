import type { Model } from "mongoose";

// Mongoose's Model type is rigid via its '~standard' property, so accept any concrete
// model shape here; results are narrowed with explicit casts at usage sites.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LeanModel = Model<any, any, any, any, any, any, any>;
