import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./src/db/dbConnection.js"

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
