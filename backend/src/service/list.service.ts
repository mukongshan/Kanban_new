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
        const user = await this.userModel.findOne({ username }).exec();
        const projects = user.projects;
        const project = projects.find(project => project.id == projectid);
        const lists = project.lists;
        return lists;
    }

    async addList(username: string, projectid: string, list: List) {
        const user = await this.userModel.findOne({ username }).exec();
        const projects = user.projects;
        const project = projects.find(project => project.id == projectid);
        project.lists.push(list);
        await user.save();
    }

    async renameList(username: string, projectid: string, listid: string, newName: string) {
        const user = await this.userModel.findOne({ username }).exec();
        const project = user.projects.find(project => project.id == projectid);
        const list = project.lists.find(list => list.id == listid);
        list.name = newName;
        await user.save();
        return list;
    }

    async deleteList(username: string, projectid: string, listid: string) {
        const user = await this.userModel.findOne({ username }).exec();
        const project = user.projects.find(project => project.id == projectid);
        const listIndex = project.lists.findIndex(list => list.id == listid);
        project.lists.splice(listIndex, 1); // 删除项目
        await user.save();
        return { message: 'List deleted' };
    }

}
