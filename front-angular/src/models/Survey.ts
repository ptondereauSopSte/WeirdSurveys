interface SurveyData {
    _id: String;
    text: String;
    options:SurveyOption[];
    likes:number;
    participations:number;
    date: Date;
}

interface SurveyOptionData {
    text: String;
    percent:number;
    number:number;
}

export class Survey{
    id:String=new String()
    text:String =new String();
    options:SurveyOption[] =[];
    likes:number=0;
    participations:number=0;
    date:Date;

    fromHashMap(data: SurveyData) {
        this.id = String(data._id);
        this.text = String(data.text);
        this.likes = data.likes;
        this.participations = data.participations;
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

    fromHashMap(data: SurveyOptionData) {
        this.text = String(data.text);
        this.percent = data.percent;
        this.number = data.number;
    }
}