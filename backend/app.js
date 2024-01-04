const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://shlkumar435:12341234@cluster0.6xanxql.mongodb.net/mern_file_app",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const storage = multer.memoryStorage();
const upload = multer({ storage });

const File = mongoose.model('File', {
  name: String,
  content: String,
});



app.get("/api/file/:name", async (req, res) => {
  const { name } = req.params;
  const file = await File.findOne({ name });
  res.json(file);
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const content = file.buffer.toString("utf-8");
    const newFile = new File({ name: file.originalname, content });
    await newFile.save();

    return res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/api/download/:name", async (req, res) => {
  const { name } = req.params;
  const file = await File.findOne({ name });
  res.setHeader("Content-Disposition", `attachment; filename=${name}`);
  res.end(file.content);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
