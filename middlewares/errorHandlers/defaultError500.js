class DefaultError500 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = DefaultError500;
