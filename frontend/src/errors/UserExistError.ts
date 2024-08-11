class UserExistError extends Error {
    constructor(message: string) {
        super(message);
        this.message = '用户名已存在';
        this.name = 'UserExistError';
    }
}

export default UserExistError;