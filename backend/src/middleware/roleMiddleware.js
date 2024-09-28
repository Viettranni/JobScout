const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    console.log(req.user.role, requiredRole);
    return res
      .status(403)
      .json({ message: "Access denied. Insufficient permissions." });
  }
  next();
};

module.exports = roleMiddleware;