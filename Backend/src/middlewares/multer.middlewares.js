import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname) //after completion of project work on their becuse some it's overwrite when file name is same
    }
  })
  
  export const upload = multer({ storage: storage })

