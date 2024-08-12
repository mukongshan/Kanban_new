import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileUpload: React.FC<{ projectid: string, listid: string, missionid: string, onFileUpload: (file: File) => void }> = ({ projectid, listid, missionid, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [attachments, setAttachments] = useState<string[]>([]);

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
        setUploadStatus('上传成功');
        onFileUpload(selectedFile);

        // 更新附件列表
        setAttachments(prev => [...prev, result.filePath]);
      } else {
        setUploadStatus('上传失败');
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadStatus('上传失败');
    }
  };

  // 获取并显示已上传的附件
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await axios.get(`http://localhost:7001/missions/${missionid}/attachments`);
        if (response.data.success) {
          setAttachments(response.data.attachments);
        }
      } catch (error) {
        console.error('Error fetching attachments:', error);
      }
    };

    fetchAttachments();
  }, [missionid]);

  return (
    <div>
      <h2>附件上传</h2>
      <input type="file" id="file-input" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>上传</button>
      {uploadStatus && <p>{uploadStatus}</p>}

      <h3>已上传的附件</h3>
      <ul>
        {attachments.map((filePath, index) => (
          <li key={index}>
            <a href={filePath} target="_blank" rel="noopener noreferrer">
              {filePath.split('/').pop()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
