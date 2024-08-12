import './style.css';
import Menu from './menu';
import { useMatch } from 'react-router-dom';
import Board from './board';

const Home: React.FC = () => {
    // 尝试匹配 /:username/home/project/:projectid 路径
    const matchProject = useMatch('/:username/home/project/:projectid');
    // 尝试匹配 /:username/home 路径
    const matchHome = useMatch('/:username/home');

    let username, projectid;

    if (matchProject) {
        username = matchProject.params.username;
        projectid = matchProject.params.projectid;
    } else if (matchHome) {
        username = matchHome.params.username;
    }

    if (!username) {
        return <div>Home page</div>;
    }


    return (
        <div className='background-container'>
            <Menu username={username} />
            <Board username={username} projectid={projectid} />
        </div>

    );
};

export default Home;
