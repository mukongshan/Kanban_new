import React, { useState } from 'react';

const FileUpload: React.FC<{ missionid: string, onFileUpload: (file: File) => void }> = ({ missionid, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  // 处理文件上传
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('No file selected');
      return;
    }

    try {
      const fileInput = document.querySelector('#file-input') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // 使用 fetch API 上传文件
        const response = await fetch(`http://localhost:7001/files/upload/${missionid}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setUploadStatus('File uploaded successfully');
          onFileUpload(fileInput.files[0]);
        } else {
          setUploadStatus('Upload failed');
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadStatus('File upload failed');
    }
  };

  return (
    <div>
      <h2>附件上传</h2>
      <input type="file" id="file-input" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>上传</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default FileUpload;
