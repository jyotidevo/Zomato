const cors = require("cors");
const express = require("express");
const db = require("./Config/db");

const app = express();
const PORT = process.env.PORT || 8003;

const UserRoute = require('./Routes/UserRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running' });
});

app.use('/api/users', UserRoute);

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('Database connected successfully');

        await db.sync({ force: false });
        console.log('Database synced successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();