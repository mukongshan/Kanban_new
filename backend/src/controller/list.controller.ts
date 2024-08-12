// src/controllers/project.controller.ts
import { Controller, Get, Post, Put, Del, Body, Param } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { Inject } from '@midwayjs/core';
import { ListService } from '../service/list.service';

@Controller(`/:username/board/projects/:projectid/lists_2`)
export class ListController {

    @Inject()
    listService: ListService;
    @Inject()
    ctx: Context

    @Get('/')
    async getLists(@Param('username') username: string, @Param('projectid') projectid: string) {
        try {
            console.log('Get lists of project:', projectid);
            if (projectid) {
                const lists = await this.listService.getLists(username, projectid);
                this.ctx.body = { lists };
                return {
                    data: lists,
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
    async addList(@Param('username') username: string, @Param('projectid') projectid: string, @Body() list: { id: string, name: string, missions: [] }) {
        try {
            console.log(username, list);
            await this.listService.addList(username, projectid, list);
            return {
                success: true,
                message: 'add list successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Put('/:listid')
    async renameList(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Body() newName: { name: string }) {
        try {
            await this.listService.renameList(username, projectid, listid, newName.name);
            return {
                success: true,
                message: 'rename list successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Del('/:listid')
    async deleteList(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string) {
        try {
            await this.listService.deleteList(username, projectid, listid);
            return {
                success: true,
                message: 'del list successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}
