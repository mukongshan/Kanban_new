import 'koa';

declare module 'koa' {
    interface Request {
        files?: {
            [key: string]: {
                name: string;
                path: string;
                type: string;
                size: number;
                // 你可以根据需要添加更多属性
            };
        };
    }
}
