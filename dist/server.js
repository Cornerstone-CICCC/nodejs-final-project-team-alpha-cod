"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
//Routes
app.get('/', (req, res) => {
    res.status(200).send('Welcome to my server');
});
app.use((req, res) => {
    res.status(404).send('Invalid route!');
});
//Connect to server
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.DATABASE_URI;
mongoose_1.default
    .connect(MONGODB_URI, { dbName: 'tictactoe' })
    .then(() => {
    console.log(`Connected to MongoDB`);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error(err);
    throw err;
});
