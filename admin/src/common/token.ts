const jwt = require('jsonwebtoken');
import { config } from '../../config';


const generateAccessToken = (id) => {
  const access_token = jwt.sign({ id }, config.token.access_token, { expiresIn: '30d' });
  return access_token;
};
/* 
const generateTempToken = (id, minute) => {
  const access_token = jwt.sign({ id }, config.token.access_token, { expiresIn: 60 * minute });

  return access_token;
};

const  generatePassCodeToken = (id, passCode) => {
  const fogotPWCode = jwt.sign({ id, passCode }, config.token.forgot_password_code);

  return fogotPWCode;
}; */

export { generateAccessToken  }
