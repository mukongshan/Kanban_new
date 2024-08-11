import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ missionid, onFileUpload }: { missionid: string, onFileUpload: (filePath: string) => void }) {


  // 定义两个状态：file 和 uploading
  const [file, setFile] = useState<File | null>(null);  // 存储用户选择的文件
  const [uploading, setUploading] = useState(false);    // 表示是否正在上传文件

  // 当用户选择文件时调用此函数
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      console.log('Selected file name:', selectedFile.name);  // 打印文件名
      setFile(selectedFile);
    }
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();  // 创建一个新的 FormData 对象，用于存储文件数据
      formData.append('file', file);    // 将选中的文件添加到 FormData 中

      setUploading(true);  // 将上传状态设置为 true

      try {
        // 使用 axios 发送 POST 请求，将文件上传到指定的任务
        const response = await axios.post(`http://localhost:7001/files/${missionid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',  // 设置请求头以表示这是一个文件上传请求
          },
        });
        console.log('Response:', response.data);  // 上传成功时，打印返回
        onFileUpload(response.data.filePath);  // 上传成功后，通过回调函数将文件路径传递给父组件
      } catch (error) {
        console.error('Error uploading file:', error);  // 上传失败时，打印错误信息
      } finally {
        setUploading(false);  // 上传结束后，无论成功或失败，都将上传状态设置为 false
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />  {/* 文件输入框，当用户选择文件时调用 handleFileChange 函数*/}
      <button onClick={handleUpload} disabled={uploading || !file}> {/* // 上传按钮，当正在上传或没有选择文件时禁用*/}
        {uploading ? 'Uploading...' : 'Upload File'}  {/*//如果正在上传，按钮显示 'Uploading...'，否则显示 'Upload File'*/}
      </button>
    </div>
  );
}

export default FileUpload;
