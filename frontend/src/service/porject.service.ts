import { ReturnModelType } from "@typegoose/typegoose";
import Project from "../entity/project";
import { InjectEntityModel } from "@midwayjs/typegoose";
import { Provide } from "@midwayjs/core";
import { User } from "../entity/user";

@Provide()
export class ProjectService {

  @InjectEntityModel(Project)
  projectModel: ReturnModelType<typeof Project>;
  @InjectEntityModel(User)
  userModel: ReturnModelType<typeof User>;

  async getProjects(username: string) {
    const user = await this.userModel.findOne({ username }).exec();
    const _projects = user.projects;
    return _projects;
  }

  async getOneProject(username: string, projectid: string) {
    const user = await this.userModel.findOne({ username }).exec();
    const project = user.projects.find(project => project.id == projectid);
    return project;
  }

  async addProject(username: string, project: Project) {
    const user = await this.userModel.findOne({ username }).exec();
    user.projects.push(project);
    await user.save();
  }

  async renameProject(username: string, projectid: string, newName: string) {
    const user = await this.userModel.findOne({ username }).exec();
    const project = user.projects.find(project => project.id == projectid);
    if (!project) {
      throw new Error('Project not found');
    }

    project.name = newName;
    await user.save();
    return project;
  }

  async deleteProject(username: string, projectid: string) {
    const user = await this.userModel.findOne({ username }).exec();
    const projectIndex = user.projects.findIndex(project => project.id == projectid);
    user.projects.splice(projectIndex, 1); // 删除项目
    await user.save();
    return { message: 'Project deleted' };
  }

}
