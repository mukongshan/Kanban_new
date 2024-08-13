import React, { useState } from 'react';

const FileUpload: React.FC<{ projectid: string, listid: string, missionid: string, onFileUpload: (file: File) => void }> = ({ projectid, listid, missionid, onFileUpload }) => {
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
      setUploadStatus('未选中文件');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`http://localhost:7001/files/upload/${projectid}/${listid}/${missionid}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          console.log('File uploaded successfully:', result);
          setUploadStatus('上传成功');
          onFileUpload(selectedFile);
        } else {
          console.error('File upload failed:', result.message);
          setUploadStatus(`上传失败: ${result.message}`);
        }

        // 更新附件列表
      } else {
        const errorText = await response.text(); // 获取错误消息
        console.error('File upload failed:', response.status, response.statusText, errorText);
        setUploadStatus(`上传失败: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadStatus('上传失败');
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
