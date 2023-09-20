const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      
      if(req.body.user){
        callback(null, 'images/user');
      }
      else if(req.body.client){
        callback(null, 'images/client');
      }
        
    },

    filename: (req, file, callback) =>{
        const name = (req.body.user)? 
        (
          "user-"
        ): 
        (
          (req.body.client)? 
            (
              "client-"
            ): 
            ""
        );

        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
    
});

module.exports = multer({storage: storage}).single('image');