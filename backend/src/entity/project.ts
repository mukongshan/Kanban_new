import { modelOptions, prop } from '@typegoose/typegoose';
import List from './list';

@modelOptions({ schemaOptions: { _id: false } })
export class Project {
    @prop({ type: () => [String], default: [] })
    public owners: string[];
    @prop()
    public id: string;
    @prop()
    public name: string;
    @prop({ type: () => [List], default: [] })
    public lists?: List[];
}

export default Project;