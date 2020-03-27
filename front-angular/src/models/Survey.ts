import { User } from './User';

interface SurveyData {
    _id: String;
    text: String;
    options:SurveyOption[];
    likes:number;
    participations:number;
    warnings:number;
    category:String;
    date: Date;
}

interface SurveyOptionData {
    text: String;
    percent:number;
    number:number;
    users:User[];
}

export class Survey{
    id:String;
    text:String =new String();
    options:SurveyOption[] =[];
    likes:number=0;
    participations:number=0;
    warnings:number=0;
    category:String;
    date:Date=new Date();

    fromHashMap(data: SurveyData) {
        this.id = String(data._id);
        this.text = String(data.text);
        this.likes = data.likes;
        this.participations = data.participations;
        this.warnings = data.warnings;
        this.category = String(data.category);
        this.date = data.date;
        this.options = []
        data.options.forEach((optionJson)=>{
            const surveyOption = new SurveyOption();
            surveyOption.fromHashMap(optionJson);
            this.options.push(surveyOption);
        });
    }

    addOption(optionText : String){
        let newOption = new SurveyOption();
        newOption.text=optionText;
        newOption.percent=0;
        newOption.number=0;
        newOption.users=[];
        //Check si déjà dans les options
        let isIn=false;
        this.options.forEach((option)=>{
            isIn = isIn || option.text==optionText;
        })
        if (!isIn){
            this.options.push(newOption);
        }
    }

    deleteOption(optionText : String){
        let newOptionsList:SurveyOption[]=[]
        this.options.forEach((option)=>{
            if (option.text!=optionText){
                newOptionsList.push(option);
            }
        })
        this.options=newOptionsList.slice()
    }
}

export class SurveyOption{
    text:String;
    percent:number;
    number:number;
    users:User[];

    fromHashMap(data: SurveyOptionData) {
        this.text = String(data.text);
        this.percent = data.percent;
        this.number = data.number;
        this.users = []
        if(data.users){
            data.users.forEach((userJson)=>{
                const user = new User();
                user.fromHashMap(userJson);
                this.users.push(user);
            });
        }
    }
}