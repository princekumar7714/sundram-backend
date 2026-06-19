// One-time script to create (or fix) the admin user directly in MongoDB.
//
// HOW TO RUN (inside the backend folder, on your own computer):
//   node seedAdmin.js
//
// Make sure your .env file (with MONGO_URI) is present in this same folder
// before running.

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const ADMIN_EMAIL = "admin@sundramagri.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "Admin";

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        let user = await User.findOne({ email: ADMIN_EMAIL });

        if (user) {
            user.password = ADMIN_PASSWORD; // pre-save hook will hash it
            user.isAdmin = true;
            await user.save();
            console.log(`Updated existing user "${ADMIN_EMAIL}" -> isAdmin: true, password reset.`);
        } else {
            user = await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                isAdmin: true,
            });
            console.log(`Created new admin user "${ADMIN_EMAIL}".`);
        }

        console.log("\n--- Admin Login Details ---");
        console.log(`Email:    ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log("Login at: /admin/login");
        console.log("----------------------------\n");

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error.message);
        process.exit(1);
    }
};

run();