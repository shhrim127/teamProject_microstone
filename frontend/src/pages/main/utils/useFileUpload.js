import { useState } from 'react';

const useFileUpload = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const handleUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  return {
    file,
    dragging,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleUploadClick,
  };
};

export default useFileUpload;
