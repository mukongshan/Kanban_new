// src/controllers/project.controller.ts
import { Controller, Get, Post, Put, Del, Body, Param } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ProjectService } from '../service/porject.service';
import { Inject } from '@midwayjs/core';
import { UserService } from '../service/user.service';

@Controller(`/:username/home/projects_1`)
export class ProjectController {

  @Inject()
  userService: UserService;
  @Inject()
  projectService: ProjectService;
  @Inject()
  ctx: Context;


  @Get('/:projectid')
  async getOneProject(@Param('username') username: string, @Param('projectid') projectid: string) {
    try {
      console.log('Get a project...')
      const project = await this.projectService.getOneProject(projectid);
      this.ctx.body = { project };
      // console.log('get:', project);
      return {
        data: project,
        success: true,
        message: 'get project successfully',
      };
    } catch (error) {
      console.log('get project error:', error);
      this.ctx.body = {
        success: false,
        message: error.message
      };
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('/')
  async getUserProjects(@Param('username') username: string) {
    try {
      console.log('Get projects...')
      const projects = await this.userService.getUserProjects(username);
      this.ctx.body = { projects };
      console.log(projects)
      return {
        data: projects,
        success: true,
        message: 'get project successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }



  @Post('/')
  async addProject(@Param('username') username: string, @Body() project: { owners: [], id: string, name: string, lists: [] }) {
    try {
      console.log(username, project);
      await this.projectService.addProject(username, project);
      return {
        success: true,
        message: 'add project successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Put('/:projectid')
  async renameProject(@Param('username') username: string, @Param('projectid') projectid: string, @Body() newName: { name: string }) {
    try {
      await this.projectService.renameProject(projectid, newName.name);
      return {
        success: true,
        message: 'rename project successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Del('/:projectid')
  async deleteProject(@Param('username') username: string, @Param('projectid') projectid: string, ctx: Context) {
    try {
      await this.projectService.deleteProject(username, projectid);
      return {
        success: true,
        message: 'del project successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
