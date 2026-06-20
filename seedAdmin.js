// One-time script to create (or fix) the admin user in MySQL.
//
// HOW TO RUN (inside the backend folder on your own computer):
//   node seedAdmin.js

import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import sequelize from "./config/sequelize.js";
import User from "./models/sql/User.js";

dotenv.config();

const ADMIN_EMAIL = "admin@sundramagri.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_NAME = "Admin";

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL");

    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existing) {
      existing.password = hashed;
      existing.isAdmin = true;
      await existing.save();
      console.log(`Updated existing admin "${ADMIN_EMAIL}" (password reset).`);
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashed,
        isAdmin: true,
      });
      console.log(`Created new admin user "${ADMIN_EMAIL}".`);
    }

    console.log("\n--- Admin Login Details ---");
    console.log(`Email:    ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("Login at: /api/auth/login");
    console.log("----------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

run();

