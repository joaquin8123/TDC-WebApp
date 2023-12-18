import { jwtDocode } from 'jwt-decode'

const decodeToken = (token) => {
  jwt.verify(token, "jwt-3ncrypt3d-p4ssw0rd", (error, decode) => {
    if (error) {
      console.log("Error", error);
    } else {
      console.log("Decode", decode);
    }
  });
};

export default decodeToken;
