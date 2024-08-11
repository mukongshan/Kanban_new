
export interface Comment {
    id: string;
    name: string;
}

export interface Mission {
    id: string;
    name: string;
    comments: Comment[];
}

export interface List {
    id: string;
    name: string;
    missions: Mission[];
}

export interface Project {
    id: string;
    name: string;
    lists: List[];
}

export interface Info {
    username?: string;
    projectid?: string;
    listid?: string;
    missionid?: string;
}