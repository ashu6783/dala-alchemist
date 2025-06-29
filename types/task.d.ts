export interface Task{
    TaskId:string;
    TaskName:string;
    Category:string;
    Duration:number;
    RequiredSkills:string[];
    PreferredPhases:number[];
    MaxConcurrent:number;
}