"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//Frontend
app.use((0, cors_1.default)({
    //Astro port
    origin: "http://localhost:4321",
    //Cookie transfer
    credentials: true
}));
// Users
app.use('/user', user_routes_1.default);
//Welcome to my server
app.get('/', (req, res) => {
    res.status(200).send("Welcome to my server");
});
app.use((req, res) => {
    res.status(404).send('Invalid route!');
});
const PORT = process.env.PORT || 3000;
if (!process.env.DATABASE_URI) {
    throw Error("Missing connection string");
}
mongoose_1.default
    .connect(process.env.DATABASE_URI, {
    dbName: 'tictactoe',
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log(`Connected to MongoDB: tictactoe`);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
