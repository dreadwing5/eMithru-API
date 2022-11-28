const { pbkdf2 } = require("crypto");

const util = require("util");
const pbkdf2Async = util.promisify(pbkdf2);

exports.encrypt = async (password) => {
  const key = await pbkdf2Async(
    password,
    process.env.PASSWORD_SALT,
    10,
    32,
    "sha512"
  );

  return Promise.resolve(key.toString("hex"));
};

exports.compare = async (password, hash) => {
  const key = await pbkdf2Async(
    password,
    process.env.PASSWORD_SALT,
    10,
    32,
    "sha512"
  );

  return Promise.resolve(key.toString("hex") === hash);
};
