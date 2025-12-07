export interface TodoItem {
    id: string;
    heading: string;
    filePath: string;
    line: number;
    done: boolean;
    createdAt: Date;
}