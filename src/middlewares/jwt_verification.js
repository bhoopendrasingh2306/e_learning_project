var jwt = require("jsonwebtoken");
const jwtKey = "my-key";
function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "please add valid token" });
      } else { 
           req.token = token
        next();
      }
    });
  } else {
    res.status(403).send({ result: "please add token with header" });
  }
  console.log("middleware called", token);
}

// function verifyToken (req,res,next){
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !== 'undefined'){
//         const bearer = bearerHeader.split(" ");
//         const token = bearer[1];
//         req.token = token;
//         next();
//     }else{
//         res.send({
//             result: 'Token is not valid'
//         })
//     }
// };


module.exports = verifyToken;