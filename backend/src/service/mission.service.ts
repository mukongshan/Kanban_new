import { ReturnModelType } from "@typegoose/typegoose";
import Project from "../entity/project";
import { InjectEntityModel } from "@midwayjs/typegoose";
import { Provide } from "@midwayjs/core";
import { User } from "../entity/user";
import List from "../entity/list";
import Mission from "../entity/mission";

@Provide()
export class MissionService {


    @InjectEntityModel(Mission)
    missionModel: ReturnModelType<typeof Mission>;
    @InjectEntityModel(List)
    listModel: ReturnModelType<typeof List>;
    @InjectEntityModel(Project)
    projectModel: ReturnModelType<typeof Project>;
    @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;

    async getMissions(username: string, projectid: string, listid: string) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        const list = project.lists.find(list => list.id == listid);
        const missions = list.missions;
        console.log(missions);
        return missions;
    }

    async addMission(username: string, projectid: string, listid: string, mission: Mission) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        const list = project.lists.find(list => list.id == listid);
        list.missions.push(mission);
        await project.save();
    }

    async renameMission(username: string, projectid: string, listid: string, missionid: string, newName: string) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        const list = project.lists.find(list => list.id == listid);
        const mission = list.missions.find(mission => mission.id == missionid);
        mission.name = newName;
        await project.save();
        return mission;
    }

    async deleteMission(username: string, projectid: string, listid: string, missionid: string) {
        const project = await this.projectModel.findOne({ projectid }).exec();
        const list = project.lists.find(list => list.id == listid);
        const missionIndex = list.missions.findIndex(mission => mission.id == missionid);
        list.missions.splice(missionIndex, 1); // 删除项目
        console.log('Delete mission:', missionid);
        await project.save();
        return { message: 'Mission deleted' };
    }

    // 将附件路径添加到任务中
    async addFilesToMission(missionid: string, fileUrls: string[]): Promise<void> {
        await this.missionModel.findOneAndUpdate(
            { id: missionid }, // 使用自定义的 id 字段进行查找
            { $push: { attachments: { $each: fileUrls } } },
            { new: true } // 返回更新后的文档
        );
    }

    // addFile(username: string, projectid: string, listid: string, missionid: string, filePath: string) {
    //     throw new Error('Method not implemented.');
    // }

}
