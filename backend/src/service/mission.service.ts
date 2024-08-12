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
        const id = projectid;
        const project = await this.projectModel.findOne({ id }).exec();
        const list = project.lists.find(list => list.id == listid);
        const missions = list.missions;
        console.log(missions);
        return missions;
    }

    async addMission(username: string, projectid: string, listid: string, mission: Mission) {
        const id = projectid;
        const project = await this.projectModel.findOne({ id }).exec();
        const list = project.lists.find(list => list.id == listid);
        list.missions.push(mission);
        await project.save();
    }

    async renameMission(username: string, projectid: string, listid: string, missionid: string, newName: string) {
        const id = projectid;
        const project = await this.projectModel.findOne({ id }).exec();
        const list = project.lists.find(list => list.id == listid);
        const mission = list.missions.find(mission => mission.id == missionid);
        mission.name = newName;
        await project.save();
        return mission;
    }

    async deleteMission(username: string, projectid: string, listid: string, missionid: string) {
        const id = projectid;
        const project = await this.projectModel.findOne({ id }).exec();
        const list = project.lists.find(list => list.id == listid);
        const missionIndex = list.missions.findIndex(mission => mission.id == missionid);
        list.missions.splice(missionIndex, 1); // 删除项目
        console.log('Delete mission:', missionid);
        await project.save();
        return { message: 'Mission deleted' };
    }


    async addAttachmentToMission(projectid: string, listid: string, missionid: string, filePath: string) {
        const project = await this.projectModel.findOne({ id: projectid }).exec();
        const list = project.lists.find(list => list.id == listid);
        const mission = list.missions.find(mission => mission.id == missionid);
        mission.attachments.push(filePath);
        project.save();
    }

    async getAttachments(projectid: string, listid: string, missionid: string) {
        const project = await this.projectModel.findOne({ id: projectid }).exec();
        const list = project.lists.find(list => list.id == listid);
        const mission = list.missions.find(mission => mission.id == missionid);
        return mission.attachments;
    }

}
