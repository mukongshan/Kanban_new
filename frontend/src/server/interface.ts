
export interface Comment {
    id: string;
    name: string;
}

export interface Mission {
    id: string;
    name: string;
    comments: Comment[];
    attachments: string[];
}

export interface Comment {
    id: string;
    username: string;
    time: string;
    content: string;
}

export interface List {
    id: string;
    name: string;
    missions: Mission[];
}

export interface Project {
    owners: string[];
    id: string;
    name: string;
    lists: List[];
}

export interface Info {
    username?: string;
    projectid?: string;
    list?: List;
    listid?: string;
    mission?: Mission;
    missionid?: string;
    comment?: Comment;

    children?: React.ReactNode; // 添加 children 属性
}