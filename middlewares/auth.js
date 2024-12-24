const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // Throwing a custom error for missing/invalid authorization header
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach payload to the request object
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    // Throwing a custom error for invalid token
    throw new UnauthorizedError("Invalid token");
  }
};

module.exports = auth;
