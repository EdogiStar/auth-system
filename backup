
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


const connectDB = require('./config/db');


app.use(express.json());
app.use(express.urlencoded({extended: false}));


const port = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoute');


app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Auth System Backend API is running...');
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
