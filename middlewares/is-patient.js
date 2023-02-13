import jwt from 'jsonwebtoken';

const isPatient = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization')
    if (authHeader) {
      const error = new Error('Not authenticated!');
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      const error = new Error('Not authenticated!');
      error.statusCode = 401;
      throw error;
    }
    // TODO: check that this user is a patient
    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export default isPatient;