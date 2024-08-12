// src/controllers/project.controller.ts
import { Controller, Get, Post, Put, Del, Body, Param } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { Inject } from '@midwayjs/core';
import Comment from '../entity/comment';
import { CommentService } from '../service/comment.service';

@Controller(`/:username/board/projects/:projectid/lists/:listid/missions/:missionid/comments_4`)
export class CommentController {

    @Inject()
    commentService: CommentService;
    @Inject()
    ctx: Context

    @Get('/')
    async getComments(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string) {
        try {
            if (projectid) {
                const comments = await this.commentService.getComments(username, projectid, listid, missionid);
                this.ctx.body = { comments };
                return {
                    data: comments,
                    success: true,
                    message: 'get Comment successfully',
                };
            } else {
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
    async addComment(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string, @Body() comment: Comment) {
        try {
            await this.commentService.addComment(username, projectid, listid, missionid, comment);
            return {
                success: true,
                message: 'add Comment successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Put('/:commentid')
    async renameComment(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string, @Param('commentid') commentid: string, @Body() newName: { name: string }) {
        try {
            await this.commentService.renameComment(username, projectid, listid, missionid, commentid, newName.name);
            return {
                success: true,
                message: 'rename comment successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    @Del('/:commentid')
    async deleteComment(@Param('username') username: string, @Param('projectid') projectid: string, @Param('listid') listid: string, @Param('missionid') missionid: string, @Param('commentid') commentid: string) {
        try {
            await this.commentService.deleteComment(username, projectid, listid, missionid, commentid);
            return {
                success: true,
                message: 'del comment successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}
