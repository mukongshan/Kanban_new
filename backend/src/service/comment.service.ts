import { ReturnModelType } from "@typegoose/typegoose";
import Project from "../entity/project";
import { InjectEntityModel } from "@midwayjs/typegoose";
import { Provide } from "@midwayjs/core";
import { User } from "../entity/user";
import List from "../entity/list";
import Mission from "../entity/mission";
import Comment from "../entity/comment";


@Provide()
export class CommentService {

    @InjectEntityModel(Comment)
    commentModel: ReturnModelType<typeof Comment>
    @InjectEntityModel(Mission)
    missionModel: ReturnModelType<typeof Mission>;
    @InjectEntityModel(List)
    listModel: ReturnModelType<typeof List>;
    @InjectEntityModel(Project)
    projectModel: ReturnModelType<typeof Project>;
    @InjectEntityModel(User)
    userModel: ReturnModelType<typeof User>;

    async getComments(username: string, projectid: string, listid: string, missionid: string) {
        const project = await this.projectModel.findOne({ id: projectid }).exec();
        const mission = await this.findMission(project, listid, missionid);
        const comments = mission.comments;
        console.log(comments);
        return comments;
    }

    async addComment(username: string, projectid: string, listid: string, missionid: string, comment: Comment) {
        const project = await this.projectModel.findOne({ id: projectid }).exec();
        const mission = await this.findMission(project, listid, missionid);
        mission.comments.push(comment);
        await project.save();
    }

    async renameComment(username: string, projectid: string, listid: string, missionid: string, commentid: string, newName: string) {
        const project = await this.projectModel.findOne({ id: projectid }).exec();
        const mission = await this.findMission(project, listid, missionid);
        const comment = mission.comments.find(comment => comment.id == commentid)
        comment.content = newName;
        await project.save();
        return mission;
    }

    async deleteComment(username: string, projectid: string, listid: string, missionid: string, commentid: string) {
        const project = await this.projectModel.findOne({ id: projectid }).exec();
        const mission = await this.findMission(project, listid, missionid);
        const commentIndex = mission.comments.findIndex(comment => comment.id == commentid);
        mission.comments.splice(commentIndex, 1); // 删除项目
        console.log('Delete comment:', commentid);
        await project.save();
        return { message: 'comment deleted' };
    }

    async findMission(project: Project, listid: string, missionid: string): Promise<Mission> {
        const list = project.lists.find(list => list.id == listid);
        const mission = list.missions.find(mission => mission.id == missionid);
        return mission
    }


}
