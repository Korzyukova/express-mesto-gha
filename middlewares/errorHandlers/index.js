const DefaultError500 = require('./defaultError500');
const RemoveCardError403 = require('./removeCardError403');
const AuthorizationError401 = require('./authorizationError401');
const WrongDataError400 = require('./wrongDataError400');
const NotFoundError404 = require('./notFoundError404');
const UserExistsError409 = require('./userExistsError409');

module.exports = {
  DefaultError500,
  AuthorizationError401,
  RemoveCardError403,
  WrongDataError400,
  NotFoundError404,
  UserExistsError409,
};
