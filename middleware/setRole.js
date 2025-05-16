module.exports = (req, res, next) => {
  res.locals.role = (req.user && req.user.role) || (req.session && req.session.role) || null;
  next();
}; 