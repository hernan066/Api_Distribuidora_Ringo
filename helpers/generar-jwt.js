const jwt = require("jsonwebtoken");

/* const getToken = (id = "") => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
}; */

const getToken = (payload) => {
  return jwt.sign({
      data: payload
  }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const getTokenData = (token) => {
  let data = null;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
          console.log('Error al obtener data del token');
      } else {
          data = decoded;
      }
  });

  return data;
}

module.exports = {
  getToken,
  getTokenData
};
