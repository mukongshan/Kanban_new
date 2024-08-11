import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { _id: false } })
export class Comment {
    @prop()
    public id: string;
    @prop()
    public username: string;
    @prop()
    public time: string;
    @prop()
    public content: string;
}

export default Comment;