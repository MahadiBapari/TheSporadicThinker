const express = require('express');
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const { errorResponserHandler, invalidPathHandler } = require('./middleware/errorHandler')

//routes
const userRoutes = require('./routes/userRoutes')

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.get("/", (req,res) => {
    res.send("server choltase");
});

app.use("/api/users", userRoutes);
app.use(errorResponserHandler);
app.use(invalidPathHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));