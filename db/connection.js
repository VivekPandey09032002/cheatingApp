import mongoose from "mongoose";

const connectDB = async (DATBASE_NAME, DATABASE_URL) => {
    const OPTIONS = {
        dbName : DATBASE_NAME
    }
    await mongoose.connect(DATABASE_URL,OPTIONS)
    console.log('connected to db')
}

export default connectDB

