require("dotenv").config();

const cors = require("cors");
const express = require("express");
const db = require("./Config/db");

const app = express();
const PORT = process.env.PORT || 8003;

const UserRoute = require('./Routes/UserRoutes');
const ProductRoute = require('./Routes/ProductRoutes');

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get('/', (req, res) => {
    res.json({ message: 'Backend API is running' });
});

app.use('/api/users', UserRoute);
app.use('/api/product', ProductRoute);

const startServer = async () => {
    try {
        await db.authenticate();
        console.log('Database connected successfully');

        await db.sync({ alter: true });
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