exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // 로그인 되어 있으면 true
    return next();
  }
  return res.redirect("/auth/login");
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // 로그인 안 되어 있으면 true
    return next();
  }
  return res.redirect("/");
};
