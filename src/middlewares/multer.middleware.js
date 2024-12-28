import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {

      cb(null, file.originalname)//hamari file jo hamre file k name h vaise hi save hoogi
    }
  })
  
  const upload = multer({ storage: storage })