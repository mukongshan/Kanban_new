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
        const user = await this.userModel.findOne({ username }).exec();
        const project = user.projects.find(project => project.id == projectid);
        const list = project.lists.find(list => list.id == listid);
        const missions = list.missions;
        console.log(missions);
        return missions;
    }

    async addMission(username: string, projectid: string, listid: string, mission: Mission) {
        const user = await this.userModel.findOne({ username }).exec();
        const project = user.projects.find(project => project.id == projectid);
        const list = project.lists.find(list => list.id == listid);
        list.missions.push(mission);
        await user.save();
    }

    async renameMission(username: string, projectid: string, listid: string, missionid: string, newName: string) {
        const user = await this.userModel.findOne({ username }).exec();
        const project = user.projects.find(project => project.id == projectid);
        const list = project.lists.find(list => list.id == listid);
        const mission = list.missions.find(mission => mission.id == missionid);
        mission.name = newName;
        await user.save();
        return mission;
    }

    async deleteMission(username: string, projectid: string, listid: string, missionid: string) {
        const user = await this.userModel.findOne({ username }).exec();
        const project = user.projects.find(project => project.id == projectid);
        const list = project.lists.find(list => list.id == listid);
        const missionIndex = list.missions.findIndex(mission => mission.id == missionid);
        list.missions.splice(missionIndex, 1); // 删除项目
        console.log('Delete mission:', missionid);
        await user.save();
        return { message: 'Mission deleted' };
    }

    // 将附件路径添加到任务中
    async addAttachment(missionid: string, filePath: string) {
        await this.missionModel.findByIdAndUpdate(missionid, {
            $push: { attachments: filePath },
        });
    }

}
