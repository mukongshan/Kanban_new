import { prop, index, modelOptions } from '@typegoose/typegoose';
import { Project } from './project';

@modelOptions({ schemaOptions: { _id: false } })
@index({ username: 1 }, { unique: true })
export class User {
    @prop()
    public username?: string;

    @prop()
    public email?: string;

    @prop()
    public password?: string;

    @prop({ type: () => [Project], default: [] })
    public projects?: Project[];
}

export default User;
