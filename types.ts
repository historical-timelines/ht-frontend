interface Linked {
    links?: string[];
}

export interface TimelineEvent extends Linked {
    title: string;
    description: string;
    date: Date;
}

export interface Period extends Linked {
    title: string;
    start: Date;
    end: Date;
    description: string;
}

export interface Timeline {
    events: TimelineEvent[];
    periods: Period[];
}