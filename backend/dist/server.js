"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const points_routes_1 = __importDefault(require("./routes/points.routes")); // ✅ Import the correct router
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//front
app.use((0, cors_1.default)({
    origin: 'http://localhost:4321',
    credentials: true
}));
const SIGN_kEY = process.env.COOKIE_SIGN_KEY;
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
if (!SIGN_kEY || !ENCRYPT_KEY) {
    throw new Error('Cookie keys not found!');
}
app.use((0, cookie_session_1.default)({
    name: 'session',
    keys: [SIGN_kEY, ENCRYPT_KEY],
    maxAge: 5 * 60 * 1000
}));
app.use(express_1.default.json());
app.use('/users', user_routes_1.default);
app.use((req, res) => {
    res.status(404).send('page not found');
});
app.use('/points', points_routes_1.default); // ✅ Now it works!
app.use((req, res) => {
    res.status(404).send('points page not found');
});
const PORT = process.env.PORT || 3000;
if (!process.env.DATABASE_URI) {
    throw Error("Missing connection string");
}
mongoose_1.default
    .connect(process.env.DATABASE_URI, { dbName: 'tictactoe' })
    .then(() => {
    console.log(`Connected to MongoDB: tictactoe`);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit on failure
});
