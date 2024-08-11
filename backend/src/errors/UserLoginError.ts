class UserLoginError extends Error {
    constructor(message: string) {
        super(message);
        this.message = '用户名或密码错误';
        this.name = 'UserLoginError';
    }
}

export default UserLoginError;