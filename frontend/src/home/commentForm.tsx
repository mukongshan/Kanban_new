import React, { useCallback, useEffect, useState } from 'react';
import './style.css';
import { Info, Mission, Comment } from '../server/interface';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from './fileUpload';


const CommentForm: React.FC<Info> = ({ username, projectid, listid, mission }) => {

    const [comments, setComments] = useState<Comment[]>([]);
    const [modalType, setModalType] = useState('');
    const [currentItem, setCurrentItem] = useState<Comment>();
    const [newItem, setNewItem] = useState('');

    function getTime(): string {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    }

    const getComments = useCallback(async (mission: Mission) => {
        try {
            if (mission != undefined) {
                const response = await axios.get(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${listid}/missions/${mission.id}/comments_4`);
                if (response.data.success) {
                    console.log('Fetched Comments:', response.data.data);
                    setComments(response.data.data);
                } else {
                    console.error('Failed to fetch Comments:', response.data.message);
                }
            }
            else {
                console.log('mission is undefined');
            }
        } catch (error) {
            console.error('Error fetching Comments:', error);
        }
    }, [comments]);

    useEffect(() => {
        // 假设 fetchMissions 是一个获取 missions 的异步函数
        const fetchCommentsForMission = async (mission: Mission) => {
            // 这里模拟异步获取数据的过程
            const comments = await getComments(mission);
            if (comments != undefined) {
                setComments(prevComments => ({
                    ...prevComments, comments,
                }));
            }
        };

        if (mission != undefined) {
            fetchCommentsForMission(mission);
        }

    }, [modalType, mission]);

    const handleCloseModal = () => {
        setModalType('');
    }

    //add
    const handleAddModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setModalType('add');
    };

    const handleAddCommet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newItem.trim() && username && listid) {
            const now = getTime();
            console.log('Adding comment:', newItem);
            const newComment: Comment = { id: uuidv4(), username: username, content: newItem, time: now };

            try {
                await axios.post(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${listid}/missions/${mission?.id}/comments_4`, newComment);
                setComments([...comments, newComment]); // Add the new list to the array
                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error adding Mission:', error);
            }
        }
    };

    //choose
    const handleChooseComment = (comment: Comment) => {
        setCurrentItem(comment);
        console.log('Choosing Mission:', comment.id);
        setModalType('chooseMission');

        // navigate(`/${username}/home/project/${projectid}`);
        // Perform project-specific actions here
    };

    //set
    const handleSetModal = (comment: Comment) => {
        setCurrentItem(comment);
        setModalType('set');
    };

    //rename
    const handleRenameModal = () => {
        setModalType('rename');
    };

    const handleRenameComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentItem && newItem.trim()) {
            try {
                const response = await axios.put(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${listid}/missions/${mission?.id}/comments_4/${currentItem.id}`, { name: newItem });
                setComments(comments.map(comment => comment.id == currentItem.id ? response.data : comment));
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

    const handleDeleteComment = async () => {
        if (currentItem) {
            try {
                console.log('Deleting comment:', currentItem);
                await axios.delete(`http://localhost:7001/${username}/board/projects/${projectid}/lists/${listid}/missions/${mission?.id}/comments_4/${currentItem.id}`);
                console.log('List deleted:', currentItem);
                setComments(comments.filter(comment => comment.id != currentItem.id));
                handleCloseModal();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    //detail
    const handleDetailModal = () => {
        setModalType('detail');
    };

    return (
        <>


            <div className="comment-form">

                {comments.slice().reverse().map((comment) => (

                    <div key={comment.id} className="comment-item">
                        <div>
                            {comment.time}
                        </div>
                        <div>
                            {comment.username} : {comment.content}
                        </div>
                    </div>

                ))}
            </div>
            <button type="button" className="btn-add" onClick={() => setModalType('add')}>添加评论</button>

            {modalType === 'add' && (
                <form className="modal-form" onSubmit={handleAddCommet}>
                    <h2>创建新评论</h2>
                    <label htmlFor="new-project-name">内容: </label>
                    <input
                        type="text"
                        placeholder='评论内容'
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
                </div>
            )}

            {modalType === 'delete' && (
                <div className="modal-form">
                    <h2>确认删除</h2>
                    <p>您确定要删除该评论吗？</p>
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='button' onClick={handleDeleteComment}>确认</button>
                </div>
            )}

        </>
    );
};

export default CommentForm;
