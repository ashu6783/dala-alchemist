export interface Client{
    ClientID:string;
    PriorityLevel:number;
    ClientName:string;
    RequestedTaskIDs:string;
    GroupTag:string;
    AttributesJSON?:Record<string,any>;
}