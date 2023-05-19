import { StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
  console.log(err);
  const error = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    status: 'Error',
    message: err.message || 'internal server error',
  };

  res.status(error.statusCode).json(error);
};
export default errorHandler;
