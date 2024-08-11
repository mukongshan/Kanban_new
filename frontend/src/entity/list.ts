import { modelOptions, prop } from '@typegoose/typegoose';
import Mission from './mission';

@modelOptions({ schemaOptions: { _id: false } })
export class List {
    @prop()
    public id: string;
    @prop()
    public name: string;
    @prop({ type: () => [Mission], default: [] })
    public missions?: Mission[];
}

export default List;