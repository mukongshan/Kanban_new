import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username || !password) {
            setError('请填写所有字段');
            return;
        }

        try {
            const response = await axios.post
                ('http://localhost:7001/ui/login', { username, password });

            if (response.data.success == false) {
                setError('用户名或密码错误');
                return;
            }

            alert('登录成功');
            setError('');
            navigate(`/${username}/home`);
        } catch (err) {
            setError('登录异常');
        }
    };

    return (
        <div className='background-container'>
            <div className="login-form">
                <h1>登录</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">账号:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder='请输入账号'
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">密码:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder='请输入密码'
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div><button type="submit">登录</button><hr /></div>
                    <div><Link to='/ui/register'>还没有账号？点此注册</Link></div>
                </form>
            </div>
        </div>
    );
};

export default Login;
