import multer from "multer";
const storage = multer.memoryStorage();
const singleUpload = multer({ storage }).single("file");
export default singleUpload;
/*
Basically, it will store the uploaded file , in memory as buffer
*/