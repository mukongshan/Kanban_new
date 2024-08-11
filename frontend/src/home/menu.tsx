import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Info, Project } from '../server/interface';


const Menu: React.FC<Info> = ({ username }) => {
    const [newItem, setNewItem] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentItem, setCurrentItem] = useState('');
    const [modalType, setModalType] = useState('');
    const navigate = useNavigate();




    const getProjects = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:7001/${username}/home/projects_1`);
            if (response.data.success) {
                // console.log('Fetched projects:', response.data.data);
                setProjects(response.data.data);
            } else {
                console.error('Failed to fetch projects:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    }, [projects]);

    useEffect(() => {
        getProjects();
    }, [modalType]);



    const handleCloseModal = () => {
        setModalType('');
    }

    //add
    const handleAddModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setModalType('add');
    };

    const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newItem.trim()) {
            console.log('Adding project:', newItem);
            const newProject = { id: uuidv4(), name: newItem, lists: [] } as Project;

            try {
                await axios.post(`http://localhost:7001/${username}/home/projects_1`, newProject);
                setProjects([...projects, newProject]);
                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error adding project:', error);
            }
        }
    };

    //choose
    const handleChooseProject = (projectid: string) => {
        console.log('Choosing project:', projectid);
        navigate(`/${username}/home/project/${projectid}`);
        // Perform project-specific actions here
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

    const handleRenameProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentItem && newItem.trim()) {
            try {
                const response = await axios.put(`http://localhost:7001/${username}/home/projects_1/${currentItem}`, { name: newItem });
                setProjects(projects.map(project => project.id == currentItem ? response.data : project));
                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error renaming project:', error);
            }
        }
    };

    //delete
    const handleDeleteModal = () => {
        setModalType('delete');
    };

    const handleDeleteProject = async () => {
        if (currentItem) {
            try {
                await axios.delete(`http://localhost:7001/${username}/home/projects_1/${currentItem}`);
                setProjects(projects.filter(project => project.id != currentItem));
                handleCloseModal();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <>
            <form className="menu-form">
                <h2>项目栏</h2>
                <div>
                    <button type='button' className='btn-add' onClick={handleAddModal}>添加新项目</button>
                    <hr />
                </div>
                <div>
                    {projects.map((project) => (
                        <React.Fragment key={project.id}>
                            <button type='button' className='btn-list' onClick={() => handleChooseProject(project.id)}>{project.name}</button>
                            <button type='button' className='btn-set' onClick={() => handleSetModal(project.id)}>···</button>
                        </React.Fragment>
                    ))}
                </div>
            </form>

            {modalType === 'add' && (
                <form className="modal-form" onSubmit={handleAddProject}>
                    <h2>创建新项目</h2>
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
                    <p>您确定要删除该项目吗？</p>
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='button' onClick={handleDeleteProject}>确认</button>
                </div>
            )}

            {modalType === 'rename' && (
                <form className="modal-form" onSubmit={handleRenameProject}>
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

export default Menu;
