import React, { useState } from "react";
import axios from "axios";
import './App.css'
function App() {
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [isUpload, setIsUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFileContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/file/${fileName}`
      );
      setFileContent(response.data.content);
    } catch (error) {
      console.error("Error fetching file content:", error);
    }
  };

  const downloadFile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/download/${fileName}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleFileChange = async (event) => {
    setIsUpload(true);
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileView = () => {
    // setIsUpload(true);
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
      };

      reader.readAsText(selectedFile);
    } else {
      setIsUpload(false);
      console.log("No file selected");
    }
  };
  
  const handleFileUpload = async () => {
    setIsUpload(false);
    try {
      if (!selectedFile) {
        console.log("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post("http://localhost:5000/api/upload", formData);

      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setSelectedFile(null);
    setFileContent("");
  };

  const handleCancel = () => {
    setIsUpload(false);
    setSelectedFile(null);
    setFileContent("");
  };
  
  return (
    <div className="main">
      <div id="actions">

        <div id="fetch">
        <input
          type="text"
          placeholder="Enter full file name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

          <button disabled={isUpload} onClick={fetchFileContent}>
            Fetch Content
          </button>
          <button disabled={isUpload} onClick={downloadFile}>
            Download File
          </button>
        </div>
        <div id="upload">
          <input type="file" onChange={handleFileChange}></input>
          <button onClick={handleFileView}>View File</button>
        </div>
      </div>
      <div>
        <h2>File Content:</h2>
        <pre>{fileContent}</pre>
      </div>
      <div id="save">
        <button disabled={!isUpload} onClick={handleFileUpload}>
          Upload File
        </button>

        <button disabled={!isUpload} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default App;
