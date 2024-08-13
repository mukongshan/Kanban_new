import React, { useCallback, useEffect, useState } from 'react';
import './style.css';
import { Info, List, Mission } from '../server/interface';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import CommentForm from './commentForm';
import FileUpload from './fileUpload';


const listForm: React.FC<Info> = ({ list, username, projectid, children }) => {

    const [missions, setMissions] = useState<Mission[]>([]);
    const [modalType, setModalType] = useState('');
    const [currentItem, setCurrentItem] = useState<Mission>();
    const [newItem, setNewItem] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);

    const getMissions = useCallback(async (list: List) => {
        try {
            if (list != undefined) {
                const response = await axios.get(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${list.id}/missions_3`);
                if (response.data.success) {
                    console.log('Fetched missions:', response.data.data);
                    setMissions(response.data.data);
                } else {
                    console.error('Failed to fetch missions:', response.data.message);
                }
            }
            else {
                console.log('list is undefined');
            }
        } catch (error) {
            console.error('Error fetching missions:', error);
        }
    }, [missions]);

    useEffect(() => {
        // 假设 fetchMissions 是一个获取 missions 的异步函数
        const fetchMissionsForList = async (list: List) => {
            // 这里模拟异步获取数据的过程
            const missions = await getMissions(list);
            if (missions != undefined) {
                setMissions(prevMissions => ({
                    ...prevMissions, missions,
                }));
            }
        };

        if (list != undefined) {
            fetchMissionsForList(list);
            const currentMission = missions.find(m => m.id === currentItem?.id);
            if (currentMission) {
                setAttachments(currentMission.attachments);
            }
        }

    }, [modalType, list]);

    const handleCloseModal = () => {
        setModalType('');
    }

    //add
    const handleAddModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setModalType('add');
    };

    const handleAddMission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newItem.trim()) {
            console.log('Adding Mission:', newItem);
            const newMission: Mission = { id: uuidv4(), name: newItem, comments: [], attachments: [] }; // Generate a valid UUID

            try {
                await axios.post(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${list?.id}/missions_3`, newMission);
                setMissions([...missions, newMission]); // Add the new list to the array
                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error adding Mission:', error);
            }
        }
    };

    //choose
    const handleChooseMission = (mission: Mission) => {
        setCurrentItem(mission);
        console.log('Choosing Mission:', mission.name);
        setAttachments(mission.attachments || []);  // 每次选择任务时更新附件列表
        setModalType('chooseMission');

        // navigate(`/${username}/home/project/${projectid}`);
        // Perform project-specific actions here
    };

    //set
    const handleSetModal = (mission: Mission) => {
        setCurrentItem(mission);
        setModalType('set');
    };

    //rename
    const handleRenameModal = () => {
        setModalType('rename');
    };

    const handleRenameMission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentItem && newItem.trim()) {
            try {
                const response = await axios.put(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${list?.id}/missions_3/${currentItem.id}`, { name: newItem });
                setMissions(missions.map(mission => mission.id == currentItem.id ? response.data : mission));
                console.log(response.data);
                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error renaming Mission:', error);
            }
        }
    };

    //delete
    const handleDeleteModal = () => {
        setModalType('delete');
    };

    const handleDeleteMission = async () => {
        if (currentItem) {
            try {
                console.log('Deleting Mission:', currentItem);
                await axios.delete(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${list?.id}/missions_3/${currentItem.id}`);
                console.log('List deleted:', currentItem);
                setMissions(missions.filter(mission => mission.id != currentItem.id));
                handleCloseModal();
            } catch (error) {
                console.error('Error deleting Mission:', error);
            }
        }
    };

    //detail
    const handleDetailModal = () => {
        setModalType('detail');
    };

    //Attachment
    const handleAttachmentModal = () => {
        setModalType('attachment');
    };

    //comment
    const handleCommentModal = () => {
        setModalType('comment');
    };

    // 当文件上传成功后，这个回调函数会被调用
    const handleFileUpload = (file: File) => {

        const filePath = URL.createObjectURL(file);

        console.log('File uploaded:', filePath);
        setAttachments(prevAttachments => Array.isArray(prevAttachments) ? [...prevAttachments, filePath] : [filePath]);
    };


    return (
        <>

            {list != undefined ? (
                <React.Fragment key={list.id}>
                    <form className="list-form">
                        {list.name}
                        <button type="button" className="btn-add" onClick={handleAddModal}>添加任务</button>
                        {children}
                        <hr />
                        <div className="missions">
                            {missions.map(mission => (
                                <>
                                    <div className='mission-div' key={mission.id} onClick={() => handleChooseMission(mission)}>{mission.name}
                                        <div className='divset' onClick={(e) => {
                                            e.stopPropagation(); handleSetModal(mission)
                                        }}>··</div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </form>
                </React.Fragment>
            ) : null}

            {modalType === 'add' && (
                <form className="modal-form" onSubmit={handleAddMission}>
                    <h2>创建新任务</h2>
                    <label htmlFor="new-project-name">任务名称: </label>
                    <input
                        type="text"
                        placeholder='新任务名称'
                        value={newItem}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
                        required
                    />
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='submit'>确认</button>
                </form>
            )}

            {modalType === 'set' && (
                <div className="modal-form">
                    <h2>选项</h2>
                    <br />

                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='button' onClick={handleDeleteModal}>删除</button>
                    <button type='button' onClick={handleRenameModal}>编辑</button>
                </div>
            )}

            {modalType === 'delete' && (
                <div className="modal-form">
                    <h2>确认删除</h2>
                    <p>您确定要删除该任务吗？</p>
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='button' onClick={handleDeleteMission}>确认</button>
                </div>
            )}

            {modalType === 'rename' && (
                <form className="modal-form" onSubmit={handleRenameMission}>
                    <h2>编辑</h2>
                    <label htmlFor="new-project-name">新内容: </label>
                    <input
                        type="text"
                        placeholder='任务'
                        value={newItem}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
                        required
                    />
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='submit'>确认</button>
                </form>
            )}


            {modalType === 'chooseMission' && (
                <div className="modal-form">
                    <h2>{currentItem?.name}</h2>
                    <br />

                    <button type='button' onClick={handleCloseModal}>关闭</button>
                    <button type='button' onClick={handleDetailModal}>详情</button>
                </div>
            )}

            {modalType === 'detail' && (
                <div className="modal-form">
                    <h2>{currentItem?.name}</h2>
                    <br />

                    <button type='button' onClick={handleCloseModal}>关闭</button>
                    <button type='button' onClick={handleCommentModal}>评论</button>
                    <button type='button' onClick={handleAttachmentModal}>附件</button>
                </div>
            )}

            {modalType === 'comment' && (
                <div className="modal-form">

                    <br />
                    <CommentForm username={username} projectid={projectid} listid={list?.id} mission={currentItem} />
                    <button type='button' onClick={handleDetailModal}>返回</button>

                </div>
            )}

            {modalType === 'attachment' && (
                <>
                    {currentItem != undefined ? (
                        <div className="modal-form">
                            <button type='button' onClick={handleDetailModal}>返回</button>
                            <FileUpload
                                projectid={projectid ?? ''}
                                listid={list?.id ?? ''}
                                missionid={currentItem?.id ?? ''}
                                onFileUpload={handleFileUpload}
                            />


                            <h3>附件列表：</h3>
                            <ul>
                                {(attachments && attachments.length > 0) ? (
                                    attachments.map((filePath, index) => {
                                        // 从 filePath 中提取文件名
                                        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
                                        console.log('filePath:', filePath, 'fileName:', fileName);
                                        return (
                                            <li key={index}>
                                                <a href={`http://localhost:7001/files/download/${fileName}`} download target='_blank'>
                                                    {fileName}
                                                </a>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li>暂无附件</li>
                                )}
                            </ul>
                        </div>
                    ) : null}
                </>
            )}


        </>
    );
};

export default listForm;
