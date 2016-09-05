import { Mongo } from "meteor/mongo";
export const Forms = new Mongo.Collection('Forms');
if(Meteor.isServer){
    Meteor.publish('Forms',function (){
        return Forms.find({});
    });
}
