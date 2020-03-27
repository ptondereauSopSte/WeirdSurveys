interface UserData {
    age: String;
    sex:String;
}
export class User{
    age:String="";
    sex:String="";

    fromHashMap(data: UserData) {
        this.age = String(data.age);
        this.sex = String(data.sex);
    }
}