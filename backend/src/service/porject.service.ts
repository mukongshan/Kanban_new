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

  async getOneProject(projectid: string) {
    const project = await this.projectModel.findOne({ projectid }).exec();
    return project;
  }

  async addProject(username: string, project: Project) {
    const newProject = await this.projectModel.create({
      owners: [username],
      id: project.id,
      name: project.name,
      lists: project.lists,
    });
    await newProject.save();
  }

  async renameProject(projectid: string, newName: string) {
    const project = await this.projectModel.findOne({ projectid }).exec();
    if (!project) {
      throw new Error('Project not found');
    }

    project.name = newName;
    await project.save();
    return project;
  }

  async deleteProject(username: string, projectid: string) {
    await this.projectModel.deleteOne({ id: projectid });
    return { message: 'Project deleted' };
  }

}
