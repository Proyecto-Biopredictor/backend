var path = require('path');
const saveImage = async (req, res, next) => {
  
  if (!req.file) {
    //If the file is not uploaded, then throw custom error with message: FILE_MISSING
    throw Error("FILE_MISSING");
  } else {
    //If the file is uploaded, then send a success response.
    res.send({ status: "success", filename: req.file.filename });
  }
};

const getImage = async(req, res) => {
  let file = req.params.file;
  let fileLocation = path.join(__dirname,'..', 'uploads', file);
  
  //res.send({image: fileLocation});
  console.log(fileLocation);
  res.sendFile(`${fileLocation}`)
};

//Express Error Handling
// app.use(function (err, req, res, next) {
//   // Check if the error is thrown from multer
//   if (err instanceof multer.MulterError) {
//     res.statusCode = 400;
//     res.send({ code: err.code });
//   } else if (err) {
//     // If it is not multer error then check if it is our custom error for FILE_MISSING & INVALID_TYPE
//     if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE") {
//       res.statusCode = 400;
//       res.send({ code: err.message });
//     } else {
//       //For any other errors set code as GENERIC_ERROR
//       res.statusCode = 500;
//       res.send({ code: "GENERIC_ERROR" });
//     }
//   }
// });

exports.saveImage = saveImage;
exports.getImage = getImage;