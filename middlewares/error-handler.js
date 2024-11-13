const errorHandler = (err, req, res, next) => {
  console.error(err);

  const { statusCode = 500, message = "An error occurred on the server" } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};

module.exports = errorHandler;
