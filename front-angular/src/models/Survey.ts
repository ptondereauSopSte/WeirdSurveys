export class Survey{
    text:String;
    options:SurveyOption[];
    likes:number;
    participations:number; 
}

export class SurveyOption{
    text:String;
    percent:number;
    number:number;
}