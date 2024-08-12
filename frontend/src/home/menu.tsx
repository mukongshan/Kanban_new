import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Info, Project } from '../server/interface';


const Menu: React.FC<Info> = ({ username }) => {
    const [newItem, setNewItem] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentItem, setCurrentItem] = useState<Project>();
    const [modalType, setModalType] = useState('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();




    const getProjects = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:7001/${username}/home/projects_1`);
            if (response.data.success) {
                console.log('Fetched projects:', response.data.data);
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
        setError('');
        setNewItem('');
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
            const newProject = { owners: [], id: uuidv4(), name: newItem, lists: [] } as Project;

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
    const handleSetModal = (cur: Project) => {
        setCurrentItem(cur);
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
                setProjects(projects.map(project => project.id == currentItem.id ? response.data : project));
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
                setProjects(projects.filter(project => project.id != currentItem.id));
                handleCloseModal();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    //add a project
    const handleAddProjectModal = async () => {
        setModalType('add-project');
    }

    const handleAddExistingProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newItem.trim()) {
            console.log('Adding an existing project:', newItem);
            try {
                const isExist = await axios.get(`http://localhost:7001/${username}/home/projects_1/${newItem}`);
                console.log('Checking project existence:', isExist.data);
                if (!isExist.data.success) {
                    console.error('Failed to find project:', newItem);
                    setError('该项目不存在');
                    return;
                }
                setError('');

                const response = await axios.post(`http://localhost:7001/${username}/home/projects_1/existing`, { id: newItem });

                if (response.data.success) {
                    const projectsResponse = await axios.get(`http://localhost:7001/${username}/home/projects_1`);
                    console.log('Fetched updated projects:', projectsResponse.data.data);
                    setProjects(projectsResponse.data.data);
                } else {
                    console.error('Failed to add project:', response.data.message);
                }

                setNewItem('');
                handleCloseModal();
            } catch (error) {
                console.error('Error adding project:', error);
            }
        }
    }

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
                            <button type='button' className='btn-set' onClick={() => handleSetModal(project)}>···</button>
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
                    <button type='button' onClick={handleAddProjectModal}>加入项目</button>
                    <button type='submit'>确认</button>
                </form>
            )}

            {modalType === 'add-project' && (
                <form className="modal-form" onSubmit={handleAddExistingProject}>
                    <h2>加入项目</h2>
                    <label htmlFor="new-project-name">项目ID: </label>
                    <input
                        type="text"
                        placeholder='项目ID'
                        value={newItem}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
                        required
                    />
                    {error && <p className="error">{error}</p>}
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='submit'>确认</button>
                </form>
            )}

            {modalType === 'set' && (
                <div className="modal-form">
                    <h2>选项</h2>
                    <p>可分享的项目ID: {currentItem?.id}</p>
                    <br />
                    <button type='button' onClick={handleCloseModal}>取消</button>
                    <button type='button' onClick={handleDeleteModal}>退出项目</button>
                    <button type='button' onClick={handleRenameModal}>重命名</button>
                </div>
            )}

            {modalType === 'delete' && (
                <div className="modal-form">
                    <h2>确认退出</h2>
                    <p>您确定要退出该项目吗？</p>
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
