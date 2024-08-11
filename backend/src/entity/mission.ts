import { modelOptions, prop } from '@typegoose/typegoose';
import Comment from './comment';

@modelOptions({ schemaOptions: { _id: false } })
export class Mission {
  @prop()
  public id: string;
  @prop()
  public name: string;
  @prop({ type: () => [Comment], default: [] })
  public comments?: Comment[];
  @prop({ type: () => [String] })
  attachments?: string[];
}

export default Mission;