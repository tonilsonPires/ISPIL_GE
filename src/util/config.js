const multer = require("multer");
const path = require("path");

const criarNomeArquivo = (req, file, cb) => {
    const ext = path.extname(file.originalname);          // .jpg, .png…
    const nomeBase = path.basename(file.originalname, ext);
    const nomeFinal = `${nomeBase}-${Date.now()}${ext}`;
    cb(null, nomeFinal);                                  // foto-perfil-1715781129665.png
};

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, "public/uploads/alunos"), // salva em sub-pasta separada
        filename: criarNomeArquivo
    }),
    limits: { fileSize: 1024 * 1024 * 5 },           // 3 MB
    fileFilter: (req, file, cb) => {
        // Aceita imagens comuns
        if (/image\/(jpeg|jpg|png|webp|gif)/.test(file.mimetype)) {
            return cb(null, true);
        }
        cb(new Error("Tipo de arquivo não permitido. Envie apenas imagens."));
    }
});

module.exports = { upload };


// const multer = require("multer")

// const upload = multer({
   
//     storage : multer.diskStorage({
//         destination : function(req,file,callback){
//             callback(null,"C:\ficheiros")
//         }
//     }) ,
//     limits : {
//         fileSize : 1024 * 1024 *3 //3mb
//     }
// })
// module.exports = {
//     upload
// }

// const multer = require("multer");
// const path = require("path");

// // Define the storage destination and filename
// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         const dir = path.join("C:\\", "ficheiros"); // Diretório no disco C:\
//         callback(null, dir);
//     },
//     filename: function (req, file, callback) {
//         // Define the filename with a unique identifier (e.g., timestamp)
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const extension = path.extname(file.originalname);
//         callback(null, uniqueSuffix + extension);
//     }
// });

// // Set up multer with storage and file size limit
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 3 // Limite de 3MB
//     },
//     fileFilter: (req, file, callback) => {
//         // Filtra tipos de arquivo permitidos (ex: apenas imagens)
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         if (allowedTypes.includes(file.mimetype)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Tipo de arquivo não permitido!"), false);
//         }
//     }
// });

// module.exports = {
//     upload
// };










//  const multer = require("multer");
//  const path = require("path");

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     return cb(null, "./public/images")
//   },
//   filename: function (req, file, cb) {
//     return cb(null, `${Date.now()}_${file.originalname}`)
//   }
// })
 
// const upload = multer({storage})
// module.exports = upload








// const multer = require("multer");
// const path = require("path");

// // Define the storage destination and filename
// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         const dir = path.join("C:\\", "ficheiros"); // Diretório no disco C:\
//         callback(null, dir);
//     },
//     filename: function (req, file, callback) {
//         // Define the filename with a unique identifier (e.g., timestamp)
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const extension = path.extname(file.originalname);
//         callback(null, uniqueSuffix + extension);
//     }
// });

// // Set up multer with storage and file size limit
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 3 // Limite de 3MB
//     },
//     fileFilter: (req, file, callback) => {
//         // Filtra tipos de arquivo permitidos (ex: apenas imagens)
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//         if (allowedTypes.includes(file.mimetype)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Tipo de arquivo não permitido!"), false);
//         }
//     }
// });

// module.exports = {
//     upload
// };