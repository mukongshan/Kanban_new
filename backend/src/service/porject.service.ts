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

  async getOneProject(id: string) {
    const project = await this.projectModel.findOne({ id }).exec();
    console.log('project:', project);
    return project;
  }

  async addProject(username: string, project: Project) {
    try {
      await this.projectModel.create({
        owners: [username],
        id: project.id,
        name: project.name,
        lists: project.lists,
      });
      const user = await this.userModel.findOne({ username }).exec();
      user.projectids.push(project.id);
      user.save();
    } catch (error) {
      throw new Error(`project失败: ${error.message}`);
    }

    console.log('add project success');
    return;
  }

  async addExistingProject(username: string, projectid: string) {
    try {
      console.log('projectid:', projectid);
      const user = await this.userModel.findOne({ username }).exec();
      user.projectids.push(projectid);
      user.save();
    } catch (error) {
      throw new Error(`existing失败: ${error.message}`);
    }
    return;
  }

  async renameProject(projectid: string, newName: string) {
    const id = projectid;
    const project = await this.projectModel.findOne({ id }).exec();
    if (!project) {
      throw new Error('Project not found');
    }

    project.name = newName;
    await project.save();
    return project;
  }

  async deleteProject(username: string, projectid: string) {
    const user = await this.userModel.findOne({ username }).exec();
    user.projectids = user.projectids.filter((id) => id !== projectid);
    user.save();
    return { message: 'Project deleted' };
  }

}
