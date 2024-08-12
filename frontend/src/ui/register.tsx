import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            setError('请填写所有字段');
            return;
        }

        if (password !== confirmPassword) {
            setError('密码不一致');
            return;
        }
        try {
            console.log('注册前');
            const response = await axios.post
                ('http://localhost:7001/user/register', { username, email, password });
            console.log('注册后');
            console.log(response.data);
            console.log(response.status);

            if (response.data.success == false) {
                setError('用户名已存在');
                return;
            }

            alert('注册成功！');
            setError('');
        }
        catch (err) {
            setError('注册异常');
            console.error(err);
        }

    };

    return (
        <div className='background-container'>
            <div className="registe-form">
                <h1>注册</h1>
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
                        <label htmlFor="email">邮箱:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder='请输入邮箱'
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                    <div>
                        <label htmlFor="confirmPassword">确认密码:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder='请再次输入密码'
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div><button type="submit">注册</button><hr /></div>
                    <div><Link to='/ui/login'>已有账号？点此登录</Link></div>
                </form>
            </div>
        </div>
    );
};

export default Register;
