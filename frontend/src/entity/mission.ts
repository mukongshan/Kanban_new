import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { _id: false } })
export class Mission {
    @prop()
    public id: string;
    @prop()
    public name: string;
    @prop({ type: () => [String], default: [] })
    public comment?: string[];
}

export default Mission;