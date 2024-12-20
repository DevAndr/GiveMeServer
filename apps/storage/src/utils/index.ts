export const editFileName = (req, file, callback) => {
    const [name, ext] = file.originalname.split('.') ;

    console.log("editFileName", name, ext, process.env.PATH_STORAGE_IMAGES);
    

    // const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}.${ext}`);
  };

export const pathUploadImages = (req, file, callback) => {
    callback(null, `${process.env.PATH_STORAGE_IMAGES}/uploads`);
}

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };