import { index, prop } from '@typegoose/typegoose';
import List from './list';

@index({ id: 1 }, { unique: true })
export class Project {
    @prop()
    public id: string;
    @prop({ type: () => [String], default: [] })
    public owners: string[];
    @prop()
    public name: string;
    @prop({ type: () => [List], default: [] })
    public lists?: List[];
}

export default Project;