// src/controllers/project.controller.ts
import { Controller, Get, Post, Put, Del, Body, Param } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { Inject } from '@midwayjs/core';
import { MissionService } from '../service/mission.service';
import Mission from '../entity/mission';

@Controller(`/:username/board/projects/:projectid/lists/:listid/missions_3`)
export class MissionController {

    @Inject()
    missionService: MissionService;
    @Inject()
    ctx: Context

    @Get('/')
    async getMissions(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string) {
        try {
            if (projectid) {
                const missions = await this.missionService.getMissions(username, projectid, listid);
                this.ctx.body = { missions };
                return {
                    data: missions,
                    success: true,
                    message: 'get lists successfully',
                };
            }
            else {
                return {
                    success: false,
                    message: 'projectid is required',
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Post('/')
    async addMission(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Body() mission: Mission) {
        try {
            await this.missionService.addMission(username, projectid, listid, mission);
            return {
                success: true,
                message: 'add mission successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Put('/:missionid')
    async renameMission(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string, @Body() newName: { name: string }) {
        try {
            await this.missionService.renameMission(username, projectid, listid, missionid, newName.name);
            return {
                success: true,
                message: 'rename mission successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Del('/:missionid')
    async deleteMission(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string) {
        try {
            await this.missionService.deleteMission(username, projectid, listid, missionid);
            return {
                success: true,
                message: 'del mission successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}
