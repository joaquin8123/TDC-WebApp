const jwt = require("jsonwebtoken");
const decodeToken = () => {
  const token = "tu-token-jwt-aqui";
  const claveSecreta = "tu-clave-secreta-aqui"; // La clave secreta utilizada para firmar el token

  jwt.verify(token, claveSecreta, (err, decoded) => {
    if (err) {
      console.error("Error al verificar el token:", err);
    } else {
      return decoded;
    }
  });
};

export default decodeToken;
