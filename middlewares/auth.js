const jwt = require('jsonwebtoken');
const { AuthorizationError401 } = require('./errorHandlers');

const errorMsg401 = 'Необходима авторизация';

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError401(errorMsg401);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthorizationError401(errorMsg401);
  }
  req.user = payload;

  next();
};
