export interface TodoItem {
    huid: string;
    heading: string;
    filePath: string;
    line: number;
    done: boolean;
    createdAt: Date;
    markedAt?: Date;
}