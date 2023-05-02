import mongoose from "mongoose";

export default async function connectToDataBase(dbConn: string) {
  try {
    console.log(`[server]: connecting to database ${dbConn}`);
    return await mongoose.createConnection(dbConn);
  } catch (error) {
    throw error;
  }
}
