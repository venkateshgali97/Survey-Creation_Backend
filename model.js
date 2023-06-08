const mongoose =  require('mongoose')
const Schema = mongoose.Schema

const RegistrationSchema = new Schema({
    name : {type:String, required:true},
    email :{type:String,required:true},
    password:{type:String,required:true},
    userType:{type:String,required:true}
})

const SurveyQuestionSchema = new Schema({
    id: { type: String },
    question: { type: String },
    type: { type: String },
    options: [{ type: String }],
    title : {type:String}
  });
  
  const PublishedSurveySchema = new Schema({
    email: { type: String },
    data: [{
      title: { type: String },
      questions: [SurveyQuestionSchema]
    }],
    users: [{ type: String }],
    status : {type : String},
    title : {type : String}
  });
  

const DraftedSurveySchema = new Schema({
  email: { type: String },
  data: [{
    title: { type: String },
    questions: [SurveyQuestionSchema]
  }],
  status :{type:String}
})

const ResponseSchema = new Schema({
  userEmail : {type:String},
  status : {type : Boolean},
  responses : {},
  surveyName : {type:String},
  adminEmail : {type:String}
})
const Registration = mongoose.model("Registration",RegistrationSchema)
const PublishedSurvey = mongoose.model("PublishedSurvey",PublishedSurveySchema)
const DraftedSurvey = mongoose.model("DraftedSurvey",DraftedSurveySchema)
const Response = mongoose.model("Response",ResponseSchema)

module.exports = {
    Registration : Registration,
    PublishedSurvey : PublishedSurvey,
    DraftedSurvey : DraftedSurvey,
    Response : Response
}