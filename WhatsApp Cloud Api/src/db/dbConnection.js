import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    const mongoURI = `${process.env.MONGO_URI}/chola_client`
     console.log(`MongoDB url:${mongoURI}`);
    const conn = await mongoose.connect(mongoURI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
   

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

 export default connectDB;
