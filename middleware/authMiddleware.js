import jwt from "jsonwebtoken";
import User from "../models/sql/User.js";

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = { id: user.id, isAdmin: user.isAdmin };
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as admin" });
  }
};

export { protect, admin };
