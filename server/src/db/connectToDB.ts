import mongoose from "mongoose";

export default async function connectToDataBase(dbConn: string) {
    try {
        await mongoose.connect(dbConn);
        console.log(`[server]: connected to database ${dbConn}`);
    } catch (error) {
        throw error;
    }
}