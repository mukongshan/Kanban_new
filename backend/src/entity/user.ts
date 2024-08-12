import { prop, index } from '@typegoose/typegoose';

@index({ username: 1 }, { unique: true })
export class User {
    @prop()
    public username?: string;

    @prop()
    public email?: string;

    @prop()
    public password?: string;

    @prop({ type: () => [String], default: [] })
    public projectids?: string[];
}

export default User;
