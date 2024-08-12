import { useCallback, useEffect, useState } from 'react';
import './style.css';
import { Info, List, Project } from '../server/interface';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import ListForm from './listForm';

const Board: React.FC<Info> = ({ username, projectid }) => {
    const [newItem, setNewItem] = useState('');
    const [project, setProject] = useState<Project>();
    const [lists, setLists] = useState<List[]>([]);

    const [currentItem, setCurrentItem] = useState('');
    const [modalType, setModalType] = useState('');
    // const navigate = useNavigate();

    const getProject = useCallback(async () => {
        if (username && projectid) {
            try {
                const response = await axios.get(`http://localhost:7001/${username}/home/projects_1/${projectid}`);
                console.log('Fetched projectData:', response.data);
                if (response.data.success && response.data.data) {
                    const projectData = response.data.data as Project;
                    setProject(projectData);
                    console.log('get', project);
                } else {
                    console.error('Failed to fetch project:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        }
    }, [username, projectid, modalType]);

    const getLists = useCallback(async () => {
        try {
            if (projectid != undefined) {
                const response = await axios.get(`http://localhost:7001/${username}/board/projects/${projectid}/lists_2`);
                if (response.data.success) {
                    console.log('Fetched lists:', response.data.data);
                    setLists(response.data.data);
                } else {
                    console.error('Failed to fetch lists:', response.data.message);
                }
            }
            else {
                console.log('Project is undefined');
            }
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    }, [lists, projectid, modalType]);



    useEffect(() => {
        getProject();
        getLists();
    }, [modalType, projectid]);





    const handleCloseModal = () => {
        setModalType('');
    }

    //add
    const handleAddModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setModalType('add');
    };

    const handleAddList = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newItem.trim()) {
            console.log('Adding list:', newItem);
            const newList: List = { id: uuidv4(), name: newItem, missions: [] }; // Generate a valid UUID

            try {
                await axios.post(`http://localhost:7001/${username}/board/projects/${projectid}/lists_2`, newList);
                setLists([...lists, newList]); // Add the new list to the array
                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error adding project:', error);
            }
        }
    };


    //set
    const handleSetModal = (id: string) => {
        setCurrentItem(id);
        setModalType('set');
    };

    //rename
    const handleRenameModal = () => {
        setModalType('rename');
    };

    const handleRenameList = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentItem && newItem.trim()) {
            try {
                const response = await axios.put(`http://localhost:7001/${username}/board/projects/${projectid}/lists_2/${currentItem}`, { name: newItem });
                setLists(lists.map(list => list.id == currentItem ? response.data : list));
                console.log(response.data);
                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error renaming list:', error);
            }
        }
    };

    //delete
    const handleDeleteModal = () => {
        setModalType('delete');
    };

    const handleDeleteList = async () => {
        if (currentItem) {
            try {
                console.log('Deleting list:', currentItem);
                await axios.delete(`http://localhost:7001/${username}/board/projects/${projectid}/lists_2/${currentItem}`);
                console.log('List deleted:', currentItem);
                setLists(lists.filter(list => list.id != currentItem));
                handleCloseModal();
            } catch (error) {
                console.error('Error deleting list:', error);
            }
        }
    };


    return (
        <>{(project != undefined) ? (
            <div className="board-form">
                <h1>{project?.name}</h1>
                <hr />
                <div>
                    {lists.map((list) => (
                        <ListForm list={list} username={username!} projectid={projectid!}>
                            <div className="listset" onClick={() => { handleSetModal(list.id); }}>
                                ···
                            </div>
                        </ListForm>
                    ))}
                    <button type='button' className='btn-add' onClick={handleAddModal}>添加新列表</button>
                </div>
            </div>

        ) : (
            <div>
                <form className='board-form'>
                    <h1>欢迎！</h1>
                </form>
            </div>
        )}

            {modalType === 'add' && (
                <form className="modal-form" onSubmit={handleAddList}>
                    <h2>创建新列表</h2>
                    <label htmlFor="new-project-name">项目名称: </label>
                    <input
                        type="text"
                        placeholder='新项目名称'
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
                    <button type='button' onClick={handleRenameModal}>重命名</button>
                </div>
            )}

            {modalType === 'delete' && (
                <div className="modal-form">
                    <h2>确认删除</h2>
                    <p>您确定要删除该列表吗？</p>
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='button' onClick={handleDeleteList}>确认</button>
                </div>
            )}

            {modalType === 'rename' && (
                <form className="modal-form" onSubmit={handleRenameList}>
                    <h2>重命名</h2>
                    <label htmlFor="new-project-name">新名称: </label>
                    <input
                        type="text"
                        placeholder='新名称'
                        value={newItem}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
                        required
                    />
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='submit'>确认</button>
                </form>
            )}
        </>
    );
};

export default Board;

