import { ReturnModelType } from "@typegoose/typegoose";
import Project from "../entity/project";
import { InjectEntityModel } from "@midwayjs/typegoose";
import { Provide } from "@midwayjs/core";
import { User } from "../entity/user";
import List from "../entity/list";

@Provide()
export class ListService {

    @InjectEntityModel(List)
    listModel: ReturnModelType<typeof List>;
    @InjectEntityModel(Project)
    projectModel: ReturnModelType<typeof Project>;
    @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;

    async getLists(username: string, projectid: string) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        const lists = project.lists;
        return lists;
    }

    async addList(username: string, projectid: string, list: List) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        project.lists.push(list);
        await project.save();
    }

    async renameList(username: string, projectid: string, listid: string, newName: string) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        const list = project.lists.find(list => list.id == listid);
        list.name = newName;
        await project.save();
        return list;
    }

    async deleteList(username: string, projectid: string, listid: string) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        const listIndex = project.lists.findIndex(list => list.id == listid);
        project.lists.splice(listIndex, 1); // 删除项目
        await project.save();
        return { message: 'List deleted' };
    }

}
