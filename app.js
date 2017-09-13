// This loads the environment variables from the .env file
var builder = require('botbuilder');
var restify = require('restify');
var spellService = require('./spell-service');
var Twit =  require('twit');
var sentimentAnalysis = require('sentiment-analysis');


var T = new Twit({
    consumer_key:'3UGIAbZhkun2Vgkw9iLx04ddo',
    consumer_secret:'sexAzr9gA1lZnkr8mxsltIHTu3NgQ4jdFBYOg0Vw4EGIkY1TWD',
    access_token:'1722061238-gGZDLo4h7bX7XnAJPQXTBmEmxUfRRgqHyiTi85c',
    access_token_secret:'ThU8SyhWgtb16DJ54f0q2GnU1fwWkC01TmvZoGG6okmRN',
  });


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({

    appId:'a0139538-7203-4933-a8d8-0bf7a57ca2d4',
    appPassword:'NbktH3gKKKMSYiMcOFf1yw3'

});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/6b34215a-6372-48c5-9e43-b74bd5c4164a?subscription-key=31ed583bb899474091f675fc13da0cff&timezoneOffset=0&verbose=true&spellCheck=true&q=");
bot.recognizer(recognizer);


//=========================================================================================================================
// Project Source Code
//
// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}

//
bot.dialog('Help', function (session) {
    session.send('Hi! Welcome to Tyson BOT');
    session.send('I am here available for chatting. You can freely ask any quries related to NUST specially EME.')
    session.send('oh yes i can also help you in decision making by analyzing tweets.')
    session.endDialog();
    //session.endDialog('If you are not a student of NUST then i can guide you about \'Admissions\', \'NUST Engineering Test\',\'NUST Campuses\',\'NUST Scholarships\' or \'NUST Hostels\'');
}).triggerAction({
    matches: 'Help'
});

//==========================================================================
// NUST Coding
//==========================================================================

// 
bot.dialog('Admissions', [
    function (session, args, next) {
        builder.Prompts.text(session,'You want to know about admission criteria or admission procedure?')
        
        
        
        session.endDialog();
    }
]).triggerAction({
    matches: 'Admissions'
});
//
bot.dialog('Fee Structure',[
    function(session)
    {
        session.send('I am sending you a link you can check the fee details from here. ')
        session.send('http://www.nust.edu.pk/Admissions/Fee%20and%20Funding/Pages/Undergraduate-Financial-Matters.aspx')
        session.endDialog();
    }
]).triggerAction({
    matches:'Fee Structure'
})
//
bot.dialog('Scholarships', function (session) {
    session.send('The University provides various types of financial support and incentives to both talented and needy students in the form of scholarships, fee waivers and deferred payments.Attach is the list of scholarships and i am going to give a link for each scholarship, if you need more information then just click on detail. ');
    let cards=NUST_Scholarships()
    var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
    session.send(reply);
    session.endDialog();
}).triggerAction({
    matches: 'Scholarships'
});
//
bot.dialog('Admission Criteria', [
    function (session, args, next) {
        session.send('NUST offers Undergraduate, Master and Phd Programs.')
        builder.Prompts.text(session,'You need admission information about which program?') 
        session.endDialog();
    }
   
]).triggerAction({
    matches: 'Admission Criteria'
});

//
bot.dialog('Admission Procedure',[
    function (session)
    {
        session.send('I am sending you a link from where you can get all the guidance regarding admission procedure.If you want to know about merit criteria for admission on the basis of NET or about Undergraduate admission 2017 then let me know.');
        session.send('http://www.nust.edu.pk/Admissions/Under-Graduate/Pages/Ineligibility-Criteria.aspx')
        session.endDialog();
    }
]).triggerAction({
    matches: 'Admission Procedure'
});
//

bot.dialog('Undergraduate',[
    function(session)
    {
        session.send('You can apply if you got minimum 60% aggregate marks each in SSC and HSSC OR equivalent exams.')
        session.send('Candidates of FA/FSc  can apply for NET on the basis of FA/FSc Part-I while  of O/A Level or any other foreign equivalent qualification can apply on the basis of O Level (SSC) equivalence certificate obtained from IBCC. ')
        session.send('Selected candidates will be required to provide Medical Certificate issued by any government hospital or a registered medical practitioner at the time of joining a programme of study.')
        builder.Prompts.text(session,'You are student of FSc or FA or O/A level?')
        session.endDialog();
    }
]).triggerAction({
    matches:'Undergraduate'
})
//
bot.dialog('FSc',[
    function(session)
    {
        session.send('Students of pre-engineering, computer science and pre-medical with additional maths are eligible for Engineering,BS Computer Science,BBA,BS Economic,BS Mass Communication,BS Public Administration,BS Accounting & Finance,BS Physics,BS Mathematics and Architecture and Industrial Design. ')
        session.send('While students of pre-medical are only eligible for BS Applied Biosciences. ')
        session.endDialog();
    }
]).triggerAction({
    matches:'FSc'
})
//
bot.dialog('FA',[
    function(session)
    {
        session.send('HSSC candidates with any combinations are eligible for BBA ,BS Economic,BS Mass Communication,BS Public Administration,BS Physics,BS Mathematics and if accounting or finance is one of majors then they are also eligible for BS Accounting & Finance.')
        session.endDialog();
    }
]).triggerAction({
    matches:'FA'
})
//
bot.dialog('O/A Level',[
    function(session)
    {
        session.send('O/A level students having O level equivalence of “Science group” and A level equivalence of “Pre-Engineering group” including Maths, Physics and Chemistry as mandatory subjects are eligible for engineering,BS Computer Science(computer cience as mandatory subject),BS Mathematics,BS Physics and Architectural and Industrial Design')
        session.send('A level equivalence of “Pre-Medical group” or any other group with three subjects including Biology and Chemistry as mandatory subjects are eligible for BS Applied Biosciences.')
        session.send('students of O / A’ Level with any combination can apply for BBA, BS Economics, BS Mass Communication ,BS Public Administration and ​BS Accounting & Finance if they have Accounting and Finance or Accountancy as one of the mandatory subject ')
        session.endDialog();
    }
]).triggerAction({
    matches:'O/A Level'
})
//
bot.dialog('NUST Campuses', [
    function (session, args, next) 
    {
        session.send('NUST is a multi-campus university spread all over Pakistan. Its central campus is in Islamabad with other campuses at Rawalpindi, Risalpur and Karachi. ');
        session.send('Please enter the city where you want to know about NUST Campues.');
    }
]).triggerAction({
    matches: 'NUST Campuses'
});
//
bot.dialog('NUST Ibd_Campuses', [
    function (session, args, next) 
    {
        session.send('In Islamabad only there is a main campus located in H-12;')
        let cards =  Campuses_Islamabad();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches: 'NUST Ibd_Campuses'
});
//
bot.dialog('NUST Pindi_Campuses', [
    function (session, args, next) 
    {
        session.send('In Rawalpindi following are 3 campuses of NUST:')
        let cards =  Campuses_Rawalpindi();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches: 'NUST Pindi_Campuses'
});
//
bot.dialog('NUST Risalpur_Campuses', [
    function (session, args, next) 
    {
        session.send('In Risalpur following are 2 campuses of NUST:')
        let cards =  Campuses_Risalpur();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches: 'NUST Risalpur_Campuses'
});
//
bot.dialog('NUST Karachi_Campuses', [
    function (session, args, next) 
    {
        session.send('There is only following 1 campus of NUST that is located in Karachi:')
        let cards =  Campuses_Karachi();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches: 'NUST Karachi_Campuses'
});

//
bot.dialog('UG Admission17',[
    function(session)
    {
        session.send('Below is the link for undergraduate admission 2017.')
        session.send('https://ugadmissions.nust.edu.pk/')
        session.endDialog();
    }
]).triggerAction({
    matches:'UG Admission17'
})
//
bot.dialog('NET Criteria',[
    function(session)
    {
        session.send('Below link provides you details about merit criteria for admission on NET basis.')
        session.send('http://www.nust.edu.pk/Admissions/Under-Graduate/Pages/Selection-Procedure.aspx')
        session.endDialog();
    }
]).triggerAction({
    matches:'NET Criteria'
})
//
bot.dialog('Programs',[
    function(session)
    {
        session.send('NUST offers different programs in Undergraduate,Postgraduate and Phd.You want information about which program?')
        session.endDialog();
    }
]).triggerAction({
    matches:'Programs'
})
//
bot.dialog('UG Program',[
    function(session)
    {
        session.send('NUST offer UG programs in "Engineering, IT and Computer Science" , "Business Studies, Social & Natural Sciences and Architecture" or "Applied Biosciences"')
        session.endDialog();
    }
]).triggerAction({
    matches:'UG Program'
})
//
bot.dialog('Engineering',[
    function(session)
    {
        session.send('NUST offer following Engineering Programs in its different campuses mentioned in the list and if you want to know about course curriculum then just click on the course detail and get the link for further updated information.')
        let cards =  Engineering_Disciplines();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'Engineering'
})
//
bot.dialog('Business',[
     function(session)
    {
        session.send('NUST offer following Business Programs in its different schools mentioned in the list and if you want to know about course curriculum then just click on it.')
        let cards =  Business_Disciplines();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'Business'
})
//
bot.dialog('Applied_Biosciences',[
    function(session)
    {
        session.send('NUST offer only one following program for pre medical students and if you want to know about course curriculum then just click on it.')
        let cards =  Applied_Biosciences_Disciplines();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'Applied_Biosciences'
})


//=========================================================================================================================
//functions
function Campuses_Rawalpindi(session)
{
    let btnCEME=new builder.CardAction(session)
    let btnMCS=new builder.CardAction(session)
    let btnNIPCONS=new builder.CardAction(session)
    btnCEME.title('CEME').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Pages/default.aspx')
    btnMCS.title('MCS').type('openUrl').value('http://nust.edu.pk/INSTITUTIONS/Colleges/MCS/Pages/default.aspx')
    btnNIPCONS.title('NIPCONS').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/NIPCONS/AboutUs/Pages/Welcome-to-NIPCONS.aspx')
    return[
        new builder.ThumbnailCard(session)
        .title('College of Electrical & Mechanical Engineering')
        .images([builder.CardImage.create(session, "https://i0.wp.com/edu.apnafort.com/wp-content/uploads/2012/10/eme-college.jpg")])
        .buttons([btnCEME]),
        new builder.ThumbnailCard(session)
        .title('Military College of Signals')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a1/MCS_Main_Gate.jpg")])
        .buttons([btnMCS]), 
        new builder.ThumbnailCard(session)
        .title('NUST Institute of Peace and Conflict Studies')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Schools/NIPCONS/AboutUs/Documents/Introduction.JPG")])
        .buttons([btnNIPCONS]),   
    ]
}
//
function Campuses_Risalpur(session)
{
    let btnCAE=new builder.CardAction(session)
    let btnMCE=new builder.CardAction(session)
    btnCAE.title('CAE').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/CAE/Pages/default.aspx')
    btnMCE.title('MCE').type('openUrl').value('http://nust.edu.pk/INSTITUTIONS/Colleges/MCE/Pages/default.aspx')
    return[
        new builder.ThumbnailCard(session)
        .title('College of Aeronautical Engineering')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CAE/AboutUs/PublishingImages/CAE.jpg")])
        .buttons([btnCAE]),
        new builder.ThumbnailCard(session)
        .title('Military College of Engineering')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/MCE/AboutUs/PublishingImages/MCE.jpg")])
        .buttons([btnMCE]),
    ]
}
//
function Campuses_Karachi(session)
{
    let btnPNEC=new builder.CardAction(session)
    btnPNEC.title('PNEC').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/PNEC/Pages/default.aspx')
    return[
        new builder.ThumbnailCard(session)
        .title('Pakitan Naval Engineering College')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/PNEC/AboutUs/PublishingImages/PNEC.jpg")])
        .buttons([btnPNEC]),
    ]
}
//
function Campuses_Islamabad(session)
{
    let btnMC=new builder.CardAction(session)
    btnMC.title('H-12').type('openUrl').value('http://www.nust.edu.pk/Pages/Home.aspx')
    return[
        new builder.ThumbnailCard(session)
        .title('NUST H-12 Main Campus')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/PNEC/AboutUs/PublishingImages/PNEC.jpg")])
        .buttons([btnMC]),
    ]
}
//
function NUST_Scholarships(session)
{
    let btnNNBS=new builder.CardAction(session)
    let btnCMEEF=new builder.CardAction(session)
    let btnUKAID=new builder.CardAction(session)
    let btnICT=new builder.CardAction(session)
    let btnUSAID=new builder.CardAction(session)
    let btnOIC=new builder.CardAction(session)
    let btnDFSA=new builder.CardAction(session)
    let btnOO=new builder.CardAction(session)
    let btnASP=new builder.CardAction(session)
    let btnFAU=new builder.CardAction(session)
    let btnMBS=new builder.CardAction(session)
    btnNNBS.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Eligibility-Criteria.aspx')
    btnCMEEF.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Scholarship-Programme-for-Talented-students-of-Khyber-Pakhtunkhawa-under-%E2%80%9CChief-Minister-Education-Endowment-Fund-(CMEEF)%E2%80%9D-.aspx')
    btnUKAID.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/PUNJAB-EDUCATIONAL-ENDOWMENT-FUND-AND-DEPARTMENT-FOR-INTERNATIONAL-DEVELOPMENT-(UKAID)-GRADUATE-LEVEL-SCHOLARSHIPS.aspx')
    btnICT.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Prime-Minister-National-ICT-RnD-Scholarship.aspx')
    btnUSAID.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Higher-Education-Commission.aspx')
    btnOIC.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Scholarships-for-Organization-of-Islamic-Cooperation-(OIC)-member-countries.aspx')
    btnDFSA.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Deferment-of-Tuition-Fee-and-Award-of-Subsistence-Allowance.aspx')
    btnOO.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Other-Opportunities.aspx')
    btnASP.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Assistance-ship-for-Postgraduate-Students.aspx')
    btnFAU.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/FINANCIAL-ASSISTANCESHIP-FOR-UNDERGRADUATE-STUDENTS.aspx')
    btnMBS.title('Detail').type('openUrl').value('http://www.nust.edu.pk/Admissions/Scholarships/Pages/Merit-Based-PG-Scholarships.aspx')
    return[
        new builder.ThumbnailCard(session)
        .title('NUST NEED BASED SCHOLARSHIP (NNBS)')
        .text('NUST provides NEED BASED SCHOLARSHIPS to its selected Under Graduate and Post Graduate students of fresh entry every year on the basis of their financial need.  ')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/Admissions/PublishingImages/NEED%20BASED%20EMBLEM.png")])
        .buttons([btnNNBS]),
        new builder.ThumbnailCard(session)
        .title('SCHOLARSHIP PROGRAMME FOR TALENTED STUDENTS OF KHYBER PAKHTUNKHAWA UNDER “CHIEF MINISTER EDUCATION ENDOWMENT FUND (CMEEF)”')
        .text('Higher Education Department, Govt. of KPK has offered Undergraduate and Postgraduate (Masters & PhD) scholarship under Chief Minister"s Educational Endowment Fund for students enrolled in Spring/Fall 2016 at NUST.  The scholarship will be awarded on the basis of merit cum-affordability.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/SiteAssets/Images/noimage.jpg")])
        .buttons([btnCMEEF]), 
        new builder.ThumbnailCard(session)
        .title('PUNJAB EDUCATIONAL ENDOWMENT FUND (PEEF) AND DEPARTMENT FOR INTERNATIONAL DEVELOPMENT (DFID) UKAID SCHOLARSHIPS')
        .text('Punjab Educational Endowment Fund (PEEF) and Department for International Development (DFID) - UKAID have jointly offered 37 x scholarships to meritorious and needy Undergraduate students  of NUST in the year 2015-16 ')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/Admissions/PublishingImages/PEEF%20LOGO.jpg")])
        .buttons([btnUKAID]),
        new builder.ThumbnailCard(session)
        .title('PRIME MINISTER"S NATIONAL ICT SCHOLARSHIP PROGRAMME')
        .text('Prime Minister’s National ICT Scholarship Program has been a flagship HRD initiative of National ICT R&D Fund. Program’s out-reach to talented students of underserved areas has made it a true success story. National ICT R&D Fund has been a scholarship awarding partner of NUST since 2007. ')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/Admissions/Scholarships/PublishingImages/ICT%20R%20And%20D%20Fund%20Logo.jpg")])
        .buttons([btnICT]),
        new builder.ThumbnailCard(session)
        .title('HEC PAK-USAID MERIT AND NEEDS BASED SCHOLARSHIP PROGRAM')
        .text('The Pak-USAID Merit and Needs based Scholarship Program Phase-II is focused on providing opportunities for access to higher education especially to under privileged candidates who, despite possessing academic merit, are unable to finance their education. The scholarship is not restricted to tuition only, but extends to accommodation and living expenses.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/Admissions/PublishingImages/HEC%20LOGO.png")])
        .buttons([btnUSAID]),
        new builder.ThumbnailCard(session)
        .title('SCHOLARSHIPS FOR ORGANIZATION OF ISLAMIC COOPERATION (OIC) MEMBER COUNTRIES')
        .text('​NUST fully shares the OIC General Secretariats vision, aim and objectives of the ‘OIC Educational Exchange Program, solidarity through academics. NUST offers 30 x scholarships for students from member countries of Organization of Islamic Cooperation (OIC).')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/Admissions/Scholarships/PublishingImages/OrganizationOfIslamicCooperation.png")])
        .buttons([btnOIC]),
        new builder.ThumbnailCard(session)
        .title('DEFERMENT OF TUITION FEE & SUBSISTENCE ALLOWANCE')
        .text('Needy students who are unable to pay the fees are allowed deferred payment on case to case basis but they are given degree after repayment of balance amount.Minimum 50% of fee is to be paid by the student in each semester with remaining 50% amount to be cleared before award of certificate so that the students can get some jobs.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/SiteAssets/Images/noimage.jpg")])
        .buttons([btnDFSA]),
        new builder.ThumbnailCard(session)
        .title('OTHER OPPORTUNITIES')
        .text('Students can also apply on their own for any other scholarship, such as those offered by(a) Higher Education Commission (HEC) (b) Shell Pakistan(c) Baitul Maal(d) Provincial Government Endowment Fund Schemes (e) Siddique Shafi Trust(f)  Atlas Foundation(g) PEC etc (h) CARMUDI Scholarships for UG Students (for more info please visit http://www.carmudi.pk/scholarship/)(j) CARMUDI Internship Opportunities for UG Students (for more info please visit http://www.carmudi.pk/careers/)')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Schools/NIPCONS/AboutUs/Documents/Introduction.JPG")])
        .buttons([btnOO]),
        new builder.ThumbnailCard(session)
        .title('ASSISTANCE-SHIP FOR POSTGRADUATE STUDENTS')
        .text('Teaching and Research Assistantship may be awarded to suitable postgraduate students who may be willing to assist the faculty not only in the conduct of undergraduate classes but also in carrying out research during the normal working hours of the institution. ')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Schools/NIPCONS/AboutUs/Documents/Introduction.JPG")])
        .buttons([btnASP]),
        new builder.ThumbnailCard(session)
        .title('FINANCIAL ASSISTANCE FOR UNDERGRADUATE STUDENTS')
        .text('In case of students registered in the semester system, which include all Engineering, Computer Science, Applied Biosciences, Business Studies, Social & Natural Sciences and Art/Design & Architecture, the financial assistance will be awarded on the basis of performance in semester exams. ')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Schools/NIPCONS/AboutUs/Documents/Introduction.JPG")])
        .buttons([btnFAU]),
        new builder.ThumbnailCard(session)
        .title('MERIT BASED MASTERS AND PHD SCHOLARSHIPS')
        .text('Students having good academic record and high research potential are given merit based scholarship to augment their academic & research progress.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Schools/NIPCONS/AboutUs/Documents/Introduction.JPG")])
        .buttons([btnMBS]),   
    ]
}
//
function Engineering_Disciplines(session)
{
    let btnENE=new builder.CardAction(session)
    let btnGE=new builder.CardAction(session)
    let btnCE=new builder.CardAction(session)
    let btnChE=new builder.CardAction(session)
    let btnME=new builder.CardAction(session)
    let btnEE=new builder.CardAction(session)
    let btnSE=new builder.CardAction(session)
    let btnBCS=new builder.CardAction(session)
    let btnMeE=new builder.CardAction(session)
    let btnASE=new builder.CardAction(session)
    let btnAVE=new builder.CardAction(session)
    let btnCoE=new builder.CardAction(session)
    let btnMts=new builder.CardAction(session)
    let btnTE=new builder.CardAction(session)
    let btnCSE=new builder.CardAction(session)
    let btnMIS=new builder.CardAction(session)
    btnENE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SCEE/Institutes/IESE/AP/UG/BEE/Pages/Course-Curriculum.aspx')
    btnGE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SCEE/Institutes/IGIS/AP/UG/BGE/Pages/Course-Curriculum.aspx')
    btnCE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SCEE/Institutes/NICE/ap/ug/BCE/Pages/Course-Curriculum.aspx')
    btnChE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SCME/ap/ug/BME-Fall-2016-Onward/Pages/Course-Curriculum-for-Fall-2016-and-onward-entries.aspx')
    btnME.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SCME/ap/ug/BME-Fall-2016-Onward/Pages/Course-Curriculum-for-Fall-2016-and-onward-entries.aspx')
    btnEE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SEECS/ap/ug/BEE/Pages/Course-Curriculum.aspx')
    btnSE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SEECS/ap/ug/BSE/Pages/Course-Curriculum.aspx')
    btnBCS.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SEECS/ap/ug/BCS/Pages/Course-Curriculum.aspx')
    btnMeE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Schools/SMME/ap/ug/BE%20Mechanical%20Engineering%202015/Pages/Course-Curriculum-for-2015-and-onword.aspx')
    btnASE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/CAE/ap/ug/BAeroE/Pages/Course-Curriculum.aspx')
    btnAVE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/CAE/ap/ug/BAE/Pages/Course-Curriculum.aspx')
    btnCoE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/ug/BCE/Pages/Course-Curriculum.aspx')
    btnMts.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/ug/BMacE/Pages/Course-Curriculum.aspx')
    btnTE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/MCS/ap/ug/BEE/Pages/Course-Curriculum.aspx')
    btnCSE.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/MCS/ap/ug/BSE/Pages/Course-Curriculum.aspx')
    btnMIS.title('Course Detail').type('openUrl').value('http://www.nust.edu.pk/INSTITUTIONS/Colleges/PNEC/ap/ug/MIS/Pages/Course-Curriculum.aspx')
    return[
        new builder.ThumbnailCard(session)
        .title('Bachelor of Environmental Engineering')
        .text('School of Civil and Environmental Engineering  (SCEE) H-12')
        //.tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/SCEE/Institutes/IESE/AP/UG/BEE/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnENE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Geoinformatics Engineering')
        .text('School of Civil and Environmental Engineering  (SCEE) H-12')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnGE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Civil Engineering')
        .text('(a) School of Civil and Environmental Engineering  (SCEE) \n (b) Military College of Engineering (MCE) ')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnCE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Chemical Engineering')
        .text('School of Chemicals and Materials Engineering (SCME) H-12')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnChE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Materials Engineering')
        .text('School of Chemicals and Materials Engineering (SCME) H-12')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnME]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Electrical Engineering')
        .text('(a) School of Electrical Engineering and Computer Science (SEECS) H-12 \n (b)College of Electrical and Mechanical Engineering (CEME) \n (c)Pakistan Navy Engineering College (PNEC) ')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnEE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Software Engineering')
        .text('School of Electrical Engineering and Computer Science (SEECS) H-12')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnSE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Science in Computer Science')
        .text('School of Electrical Engineering and Computer Science (SEECS) H-12')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnBCS]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Mechanical Engineering')
        .text('(a) School of Mechanical and Manufacturing Engineering (SMME) H-12 \n (b) College of Electrical and Mechanical Engineering (CEME)\n (c) Pakistan Navy Engineering College (PNEC)')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnMeE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Aerospace Engineering')
        .text('College of Aeronautical Engineering (CAE)')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnASE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Avionics Engineering')
        .text('College of Aeronautical Engineering (CAE)')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnAVE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Computer Engineering')
        .text('College of Electrical and Mechanical Engineering (CEME) ')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnCoE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Mechatronics Engineering')
        .text('College of Electrical and Mechanical Engineering (CEME)')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnMts]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Telecommunication Engineering')
        .text(' Military College of Signals (MCS) ')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnTE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Computer Software Engineering')
        .text(' Military College of Signals (MCS) ')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnCSE]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Science in Management Information System')
        .text('Pakistan Navy Engineering College (PNEC)')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")])
        .buttons([btnMIS]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Military Art and Science')
        .text('NUST Institute of Peace and Conflict Studies (NIPCONS)')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
    ]
}
//
function Business_Disciplines(session)
{
    return[
        new builder.ThumbnailCard(session)
        .title('Bachelors in Business Administration')
        .text('NUST Business School (NBS) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/NBS/ap/ug/BBA-2015/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelors in Accounting & Finance')
        .text('NUST Business School (NBS) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/NBS/ap/ug/Accounting-Finance/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Science in Economics')
        .text('School of Social Sciences & Humanities (S3H) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/S3H/Academic/UG/BE/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Science in Mass Communication')
        .text('School of Social Sciences & Humanities (S3H) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/S3H/Academic/UG/BSMC-Fall-2016-onward/Pages/Course-Curriculum-for-Fall-2016-and-onward-entries.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Public Administration')
        .text('School of Social Sciences & Humanities (S3H) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/S3H/Academic/UG/PBA/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Science in Mathematics')
        .text('School of Natural Sciences (SNS) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Centers/CAMP/acad/ug/BSMath/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Science in Physics')
        .text('School of Natural Sciences (SNS) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Centers/CAMP/acad/ug/BSP/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Architecture')
        .text('School of Art, Design and Architecture (SADA) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/SADA/AP/UG/BArch/Pages/default.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
        new builder.ThumbnailCard(session)
        .title('Bachelor of Industrial Design')
        .text('School of Art, Design and Architecture (SADA) H-12')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/SADA/AP/UG/Bachelor-Industrial-Design/Pages/Course-Curriculum.aspx"))
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
    ]
}
//
function Applied_Biosciences_Disciplines(session)
{
    return[
        new builder.ThumbnailCard(session)
        .title('Bachelor of Science in Applied Biosciences')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/ASAB/AP/ug/BSAB/Pages/Course-Curriculum.aspx"))
        .text('Atta-ur-Rehman School of Applied Biosciences (ASAB) H-12')
        .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/NUST_Vector.svg/220px-NUST_Vector.svg.png")]),
    ]
}


//==========================================================================
// EME Campus
//==========================================================================

//=================
//EME Departments

bot.dialog('CEME Departments',[
    function(session)
    {
        session.send('Basic Sciences & Humanities department is supporting department while all other departments offer Bachelor,Master and Phd Programs except Engineering Management which doesn"t offer any program for Undergraduate students. There are following 6 departments in EME College.')
        let cards =  CEME_Departments();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'CEME Departments'
})
//
bot.dialog('Computer Department',[
    function(session)
    {
        session.send('Computer Engineering is the practice of putting software and hardware to practical use. If you are interested in designing and fabricating of microprocessor based systems/controllers/circuits and developing result-oriented high quality software that work for the benefit of civil & defense establishments or people, then you should surely consider joining Department of Computer Engineering, College of Electrical and Mechanical Engineering – the biggest constituent College of NUST.It offer a broad spectrum of subjects covering major subjects such as programming, data structures, mathematics, logic design, computer architecture, operating systems, microprocessor-based design, software engineering, integrated circuits, signals and filters, computer networks, database engineering, computer graphics, communication systems, digital instrumentation, digital system design, digital image processing, artificial systems, digital signal processing, design project, control systems, electronics, network analysis, linear circuit analysis and computer-aided-drawing besides teaching eighteen courses of basic sciences & humanities.')
    }
]).triggerAction({
    matches:'Computer Department'
})
//EME Programs
bot.dialog('EME Programs',[
    function(session)
    {
        session.send('EME offers different Undergraduate, Master and Phd Programs.Tell me about program about which you need further details.')
    }
]).triggerAction({
    matches:"EME Programs"
})
//
bot.dialog('EME UG Program',[
    function(session)
    {
        session.send('NUST CEME offers Bachelor in Computer Engineering, Electrical Engineering, Mechanical Engineering and Mechatronics Engineering at undergraduate level.')
    }
]).triggerAction({
    matches:"EME UG Program"
})
//
bot.dialog('EME PG Program',[
    function(session)
    {
        session.send('NUST CEME offers Master degree in Computer Engineering,Computer Software Engineering, Electrical Engineering, Mechanical Engineering, Engineering Management and Mechatronics Engineering at postgraduate level.')
    }
]).triggerAction({
    matches:'EME PG Program'
})
//
bot.dialog('EME Phd Program',[
    function(session)
    {
        session.send('NUST CEME offers Phd in Computer Engineering,Computer Software Engineering, Electrical Engineering, Mechanical Engineering, Engineering Management and Mechatronics Engineering.')
    }
]).triggerAction({
    matches:'EME Phd Program'
})
//EME Labs
bot.dialog('Labs',[
    function(session)
    {
        session.send('Inorder to facilitate the students, there are different labs available for implementation of theory.You want to know about labs of which department?')
    }
]).triggerAction({
    matches:"Labs"
})
//
bot.dialog('Computer Labs',[
    function(session)
    {
        let cards =  Computer_Labs();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:"Computer Labs"
})
//
bot.dialog('Electrical Labs',[
    function(session)
    {
        let cards =  Electrical_Labs();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:"Electrical Labs"
})
//
bot.dialog('Mechatronic Labs',[
    function(session)
    {
        let cards =  Mechatronics_Labs();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:"Mechatronic Labs"
})
//
bot.dialog('Mechanical Labs',[
    function(session)
    {
        session.send('Mechanical labs are not listed.')
        /*let cards =  Mechanical_Labs();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);*/
        session.endDialog();
    }
]).triggerAction({
    matches:"Mechanical Labs"
})
//EME Courses
bot.dialog('EME Courses',[
    function(session)
    {
        session.send('EME offers a variety of courses for each discipline. All courses cover the core subjects of each respective discipline.Let me know If you want to know the detail list of subjects offered during the duration of any degree.')
    }
]).triggerAction({
    matches:'EME Courses'
})
//
bot.dialog('EME UG DCE Course',[
    function(session)
    {
        let cards =  EME_UG_DCE_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME UG DCE Course'
})
//
bot.dialog('EME UG DEE Course',[
     function(session)
    {
        let cards =  EME_UG_DEE_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME UG DEE Course'
})
//
bot.dialog('EME UG DME Course',[
     function(session)
    {
        let cards =  EME_UG_DME_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME UG DME Course'
})
//
bot.dialog('EME UG Mts Course',[
     function(session)
    {
        let cards =  EME_UG_Mts_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME UG Mts Course'
})
//
bot.dialog('EME PG&Phd DCE Course',[
    function(session)
    {
        let cards =  EME_PG_Phd_CE_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME PG&Phd DCE Course'
})
//
bot.dialog('EME PG&Phd DEE Course',[
    function(session)
    {
        let cards =  EME_PG_Phd_EE_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME PG&Phd DEE Course'
})
//
bot.dialog('EME PG&Phd DME Course',[
    function(session)
    {
        let cards =  EME_PG_Phd_ME_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME PG&Phd DME Course'
})
//
bot.dialog('EME PG&Phd Mts Course',[
    function(session)
    {
        let cards =  EME_PG_Phd_Mts_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME PG&Phd Mts Course'
})
//
bot.dialog('EME PG&Phd EM Course',[
    function(session)
    {
        let cards =  EME_PG_Phd_EM_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME PG&Phd EM Course'
})
//
bot.dialog('EME PG&Phd CSE Course',[
    function(session)
    {
        let cards =  EME_PG_Phd_CSE_Course();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'EME PG&Phd CSE Course'
})
//EME Facilities
bot.dialog('Sports',[
    function(session)
    {
        session.send('CEME offers a wide variety of sports activities. Most sports facilities have come up  Athletics track, Volleyball courts, Tennis courts, Squash courts, Hockey ground, Indoor sports hall, Swimming pool, Gymnasia and some are under development.The separate times are allocated for boys and girls. Regular inter-college/school sports competitions are held every year at the University. NUST teams have been participating and performing well in HEC inter-varsity sports competitions both at the zonal and national levels.')
    }
]).triggerAction({
    matches:'Sports'
})
//
bot.dialog('Gym',[
    function(session)
    {
        session.send('CEME is having world class Fitness center for its students and faculty.It provides excellent training facilities. This is fully air-conditioned and matted, full time indoor workouts are assisted round the clock.')
        session.endDialog();
    }
]).triggerAction({
    matches:'Gym'
})
//
bot.dialog('Riding Club',[
    function(session)
    {
        session.send('The riding club was made to facilitate students in improving their horse riding skills. Students can get the membership for horse riding club and they enjoy their rides in their free time. They can also get training if they"re beginners.')
        //session.send('http://4.bp.blogspot.com/--QAhbZVGi80/VaA9_XaskDI/AAAAAAAAAUs/v40mju29Nko/s1600/similacyprusimg1124.jpg')
        session.endDialog();
    }
]).triggerAction({
    matches:'Riding Club'
})
//
bot.dialog('Swimming Pool',[
    function(session)
    {
        session.send('The swimming pool at EME provides students with the opportunity of improving and learning the swimming skills. The water is changed regularly and filled with clean and fresh water during swimming season. Swimming competitions are also organized in which many students participate. The timings of pool suit both in-living and out-living students. You can also get membership of pool to avoid any extra or monthly charges.')
        //session.send('http://3.bp.blogspot.com/-WnS3Xj8jDnA/VaA7dftXaKI/AAAAAAAAAUg/Ysgi92uBh90/s1600/swimining%2Bpool.jpg')
        session.endDialog();
    }
]).triggerAction({
    matches:'Swimming Pool'
})
//
bot.dialog('Sports Complex',[
    function(session)
    {
        session.send('Students can play Basket Ball, Volley ball, Table Tennis and Badminton in sports complex. The army staff is employed which daily checks and take care of the facilities provided to students for a better environment and exposure of extra-curricular activities.')
        session.endDialog();
    }
]).triggerAction({
    matches:'Sports Complex'
})
//
bot.dialog('Cafeteria',[
    function(session)
    {
        session.send('There are four cafeteria"s named fresh, Kiosk ,United Cafe and Student Cafe. These cafes provide students with best quality of food. The administration made a team of Army Corps which checks almost every week the quality and the conditions in which food is cooked to ensure that the it is eatable and safe for students')
        session.endDialog();
    }
]).triggerAction({
    matches:'Cafeteria'
})
//
bot.dialog('Campus Life',[
    function(session)
    {
        session.send('The campus life of EME has its own charm and level of enjoyment. As compared to all other institutions of NUST, EME has best friendly and close environment. Students of all the departments are well familiar with each other as well their fellows of other departments. All the students visit other departments very often for the promotion of events. This makes best grooming environment in the campus life of EME.')
        session.endDialog();
    }
]).triggerAction({
    matches:'Campus Life'
})
//
bot.dialog('Events',[
    function(session)
    {
        session.send('Every year there are multiple events organized by different departments.Major events of EME which are organized every year includes EME Olympiad,COMPPEC and NERC.')
        let cards =  EME_Events();
        var reply = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cards);  // create reply with Carousel AttachmentLayout
        session.send(reply);
        session.endDialog();
    }
]).triggerAction({
    matches:'Events'
})
//=================
//EME Library

//=================
//EME Socities
bot.dialog('Societies',[
    function(session)
    {
        session.send('Apart from academia, College of EME provides its students various platforms to nourish the skills of an artist and a great leader.')
        session.send('For that there are various Societies and Clubs you can be part of')
	    session.send('1.NVC  2.SPAL  3.SAS  4.EMC  5.ASME  6.IEEE  7.ETL')
	    session.send('Do ask if you would like to know or I will recommend you one based on your interest ')
        session.endDialog();
    }
]).triggerAction({
    matches:'Societies'
})

//NVC
bot.dialog('NVC',[
    function(session)
    {
        session.send('NUST Volunteers Club is committed for developing the best possible Human Resource for the Nation with focus on Social Change')

        session.send('They have a further heirarchy in following sub wings: ')
    	session.send('1.Blood Donation Wing  2.Acadamics  3.Community Service Wing  4.Shaoor  5.Environmental Club')
	    session.send('If you have the will to do good for human kind, then this society is a must go')
	    session.send('For details visit their Facebook page:')
	    session.send('https://www.facebook.com/pg/NVC.EME/')
        session.endDialog();
    }
]).triggerAction({
    matches:'NVC'
})

//SPAL
bot.dialog('SPAL',[
    function(session)
    {
        session.send('SPAL - Society for the Promotion of Arts and Literature, is the biggest student body of the NUST College of Electrical & Mechanical Engineering, offering the students a chance to bring out their creative abilities and talents.')
        session.send('It not only gives the Engineers a chance to display their skills but also enables them to groom themselves in various fields of life other than studies.')

	    session.send('It is further divided in 7 clubs: ')

	    session.send('1.Aks.eme (Photographic Club)  2.GOONJ Media Club  3.EME Speakers Association  4.Burraq  5.Tarteel  6.Nawa e Sarosh  7.Canvas ')
	    session.send('SPAL is the best platform to enhance your artistic skills :) ')
	    session.send('For details visit their Facebook page:')
	    session.send('https://www.facebook.com/spaleme/')
        session.endDialog();
    }
]).triggerAction({
    matches:'SPAL'
})

//SAS
bot.dialog('SAS',[
    function(session)
    {
        session.send('SAS is a sports and adventure society responsible for organizing all the sports events and adventurous trips that happen both within and outside NUST CEME')
        session.send('From intra EME tournaments to inter-University fixtures, SAS provides all the sports aficionados the perfect platform to display their talent.')
	    session.send('This Society will for sure train you to be the best athlete, sportsman & leader :) ')
	    session.send('For details visit their Facebook page:')
	    session.send('https://www.facebook.com/SASNUSTCEME/')
        session.endDialog();
    }
]).triggerAction({
    matches:'SAS'
})

//EMC
bot.dialog('EMC',[
    function(session)
    {
        session.send('EME Media Club is designed to extend the outreach of EME to beyond its own walls, and provide it with all forms of media services: from photography and film making to graphic designing and video editing.')
        session.send('It aims to equip the organizing body i.e. students of EME College with tools to improve their administrative and interpersonal skills alongside the learning fundamentals of photography, videography and graphic designing.')
	    session.send('If you are fond of photography and videomaking then join EMC :) ')
	    session.send('For details visit their Facebook page:')
	    session.send('https://www.facebook.com/eme.mediaclub/')
        session.endDialog();
    }
]).triggerAction({
    matches:'EMC'
})



//ASME
bot.dialog('ASME',[
    function(session)
    {
        session.send('ASME EME is the local chapter of ASME International providing the opportunity to develop Event Management skills and to gain Technical Knowledge.')
	    session.send('Its a great platform that binds all the mechanical engineers from all over the world and keep them updated :) ')
	    session.send('For details visit their Facebook page:')
	    session.send('https://www.facebook.com/ASME.NUST.EME/')
        session.endDialog();
    }
]).triggerAction({
    matches:'ASME'
})



//IEEE
bot.dialog('IEEE',[
    function(session)
    {
        session.send('IEEE-Institute of Electrical and Electronics Engineers is the society to provide students the oppurtunity to induldge themselves in domestic as well as international IEEE hosted events. ')
	    session.send('For details visit their Facebook page:')
	    session.send('https://www.facebook.com/IEEE.CEME/')
        session.endDialog();
    }
]).triggerAction({
    matches:'IEEE'
})

//ETL
bot.dialog('ETL',[
    function(session)
    {
        session.send('The eTech Lab @ College of Electrical and Mechanical Engineering (CEME) , National University of Sciences and Technology (NUST) is a platform to nurture multifaceted research and development activity.')
	    session.send(' Software engineering, Bio-medical Engineering, Computer and Wireless Networks, Embedded Systems, FPGA design and Image processing are some of the domains in which projects are carried out. The Research group is established with the vision to promote R & D activity and develop research aptitude amongst students ')
	    session.send('For details visit their Facebook page:')
	    session.send('https://www.facebook.com/ETLceme/')
        session.endDialog();
    }
]).triggerAction({
    matches:'ETL'
})

bot.dialog('Thankyou',[
    function(session)
    {
        session.send('Pleasure is all mine')
	    session.send('Have a good day')
    }
]).triggerAction({
    matches:'Thankyou'
})

bot.dialog('Age',[
    function(session)
    {
        session.send('Im 1 year old and still in learning process')
    }
]).triggerAction({
    matches:'Age'
})
bot.dialog('Merit List',[
    function(session)
    {
        session.send('I am sending you a link from where you can get all the information regarding last year merit list')
	    session.send('http://pakprep.com/blogs/2016/11/24/closing-merit-of-nust-university-2016-for-engineering-and-computer-science/')
    }
]).triggerAction({
    matches:'Merit List'
})

bot.dialog('Why EME',[
    function(session)
    {
        session.send('Beacause EME has produced a diversed alumni since 1957 and it has got some of the best experienced faculty and most updated labs as compared to rest campuses. It has a unique senior junior bond and also plans to open an incubation centre near future.')    
    }
]).triggerAction({
    matches:'Why EME'
})

bot.dialog('Creates',[
    function(session)
    {
        session.send('Im a Final year project of 4 EME Students') 
        session.send('My Name is Tyson the bot')   
    }
]).triggerAction({
    matches:'Creates'
})
bot.dialog('Online registrations',[
    function(session)
    {
        session.send('Online Registration for NUST Entry Test 2017 (Series-3) for Undergraduate Programmes has been re-opened from 3 to 5 July 2017 with late registration fee of Rs.5000/- per program')   
    }
]).triggerAction({
    matches:'Online registrations'
})

bot.dialog('Abusive',[
    function(session)
    {
        session.send('Kindly choose appropriate language','your language.....!!!')    
    }
]).triggerAction({
    matches:'Abusive'
})
bot.dialog('Fine',[
    function(session)
    {
        session.send('Im Good,Thankyou')
        session.send('How i can help you?')    
    }
]).triggerAction({
    matches:'Fine'
})
bot.dialog('Work',[
    function(session)
    {
        session.send('Yeah! if you work hard you will surely achieve your goals')    
    }
]).triggerAction({
    matches:'Work'
})
//=================
//EME Hostels

bot.dialog('Hostels',[
    function(session)
    {
        session.send('There are currently 7 Hostels in EME College, 1 for Girls and 6 for Boys')
        session.send('3 New Hostels are currently under construction and will be functional by the mid of 2018')
        session.send('Hostles for Boys are: ')
        session.send('1.Liaquat Hostel  2.Iqbal Hostel  3.Abu Bakr Hostel  4.Jinnah Hostel  5.Hired Hostel  6.Mess Hostel ')
        session.send('For Girls there is only one Hostel')
        session.send('1.Khadija Hostel')
        session.send('To avail Hostel you have to download, fill and submit the following form to Admin Block, Cadet Batallion')
        session.send('http://www.nust.edu.pk/Pages/Download_Details.aspx?DocID=18&category=Hostel%20Accomodation%20Form')
        session.endDialog();
    }
]).triggerAction({
    matches:'Hostels'
})

//
function EME_Events(session)
{
    return[
        new builder.ThumbnailCard(session)
        .title('EME Olympiad')
        .text('EME Olympiad is also one of the biggest event of NUST. Every year Olympiad is being held in EME for 4 days. There are many thrilling events which are organized including sports, social events, Technical and arts events. The event is organized by many teams of EME stduents and different societies. Students from all over the Pakistan can participate in the events of their choice and they enjoy the this event. This Olympiad is the pride of EME which makes it the unique institution in Pakistan.')
        .images([builder.CardImage.create(session, "http://3.bp.blogspot.com/-7ladNjQBDDA/VaDRciI-w5I/AAAAAAAAAVE/SJIryW_YNuk/s1600/EME_Olympiad_2013_Poster.jpg")]),
         new builder.ThumbnailCard(session)
        .title('Computer Project Exhibition and Competition (COMPPEC)')
        .text('Every great journey begins with the smallest of steps. Likewise, each groundbreaking invention sprouts from the seed of an idea.NUST CEME has been providing the platform for talented individuals to showcase their bright, innovative ideas for more than 15 years now. COMPPEC offers a great way to reach out to a young, enthusiastic and tech-savvy audience comprising of engineering students & professionals from all over the country, where 80+ universities participate every year.')
        .images([builder.CardImage.create(session, "https://scontent-sin6-1.xx.fbcdn.net/v/t1.0-9/17862622_1353254208086805_6210647126614609891_n.jpg?oh=5b6699d118328498297fe8533c52c384&oe=5A11B493")]),
         new builder.ThumbnailCard(session)
        .title('National Engineering Robotics Contest (NERC) ')
        .text('NERC is the biggest Robotics event of Pakistan. This event is organized by the Mechatronics department. Students of Mechatronics participate in this event by making the teams and organized body of students to conduct this event is managed separately.Students from all other universities of Pakistan are openly challenge to participate in this event and defeat NUSTians.The robots are of indigenous category which includes boll potting robots, rescue mission and fighting robots (Robowars).')
        .images([builder.CardImage.create(session, "http://1.bp.blogspot.com/-PDF0Gv1y-Zg/VaAz-IxMQ9I/AAAAAAAAAT8/BY2g86mCTTg/s1600/10679651_907943782552355_6125501088366648874_o.jpg")]),      
    ]
}
//
function Computer_Labs(session)
{
    return[
        new builder.ThumbnailCard(session)
        .title('IMAGE PROCESSING LAB')
        .text('Main activities of this lab are Software Development for image processing applications, Class Projects / Assignments, Implementation and Testing of image processing Algorithms and Algorithms and Computer Programming for Numerical Analysis and Solutions')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%203-2.jpg")]),
         new builder.ThumbnailCard(session)
        .title('EMBEDDED SYSTEMS LAB')
        .text('Main activities of this lab are Design and development of digital systems Class Projects / Assignments, Implementation and evaluation of Algorithms and Programming in Assembly language')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%203-3.jpg")]),
         new builder.ThumbnailCard(session)
        .title('COMPUTING LAB')
        .text('Main activities of this lab are Algorithms and Computing in C/C++, Implementation of Data Structures using different Programming Languages and Work on Various Application Packages for Engineering Practice Module')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%204-3.jpg")]),
         new builder.ThumbnailCard(session)
        .title('DSP AND DSD LAB')
        .text('Main activities of this lab are Hardware / Software Co-Design, System Design using Verilog and HDL Tools and DLD Circuits through Verilog.Verilog Xilinx 10.1 is used as software in this lab.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%205-1.jpg")]),
         new builder.ThumbnailCard(session)
        .title('COMPUTER NETWORKS LAB')
        .text('Main activities of this lab are Network Programming, Network protocol experiments, Server configuration experiments & exercises and Implementation of Networking Solutions')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%205-3.jpg")]),
         new builder.ThumbnailCard(session)
        .title('PROJECT LAB')
        .text('Main activities of this lab are Final Year Projects.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%204-2.jpg")]),
         new builder.ThumbnailCard(session)
        .title('SYSTEM DEVELOPMENT LAB')
        .text('Main activities of this lab are Software Development, Software Modeling/Design,Process Simulation and System Testing')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%204-1.jpg")]),
    ]
}
//
function Electrical_Labs(session)
{
    return[
        new builder.ThumbnailCard(session)
        .title('Microwave & Antenna Lab')
        .text('This lab is equipped with microwave and antenna kits to give students an overview and hands on experience in this area.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/microwave.jpg")]),
        new builder.ThumbnailCard(session)
        .title('Electrical Machines Lab')
        .text('This lab is equipped with electrical machine workstations (Motors / Generators (DC, AC)) to give students an overview and hands on experience in this area.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/electrical.jpg")]),
        new builder.ThumbnailCard(session)
        .title('Embedded Systems Lab')
        .text('This single lab covers Digital Logic basics, Digital Systems Design and Digital Signal Processing applications. The scope of experiments starts from the very basic digital concepts and reaches advanced digital systems. ')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/embedded.jpg")]),
        new builder.ThumbnailCard(session)
        .title('Control & Communication Lab')
        .text('This lab is equipped with control and communication kits(Lab-Volt Analog Communications kit ,Lab-Volt Digital Communications kit, Quanser DC Motor Control kit​) to give students an overview and hands on experience in this area.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/control.jpg")]),
        new builder.ThumbnailCard(session)
        .title('Electronics Lab')
        .text('In this lab typical Experiments are meant to verify voltage and current governing laws, connecting L, C & R elements to realize basic electric circuits and study their performance.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/electronics.jpg")]),
    ]
}
//
function Mechatronics_Labs(session)
{
    return[
        new builder.ThumbnailCard(session)
        .title('Circuits Design Lab')
        .text(' Equipment in the lab(Oscilloscopes,Power Supplies DC,Function Generators,Bread Boards,Logic Probes,Desktop PCs etc)allows students to design circuits.')
        .images([builder.CardImage.create(session, "https://www.ucy.ac.cy/ece/documents/images/circuits_lab.gif")]),
        new builder.ThumbnailCard(session)
        .title('Machine Vision and Embedded Systems Lab')
        .text('This single lab covers Digital Logic basics, Digital Systems Design and Digital Signal Processing applications. The scope of experiments starts from the very basic digital concepts and reaches advanced digital systems.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/embedded.jpg")]),
        new builder.ThumbnailCard(session)
        .title('CAD/CAM Lab')
        .text('Students can use all packages installed at CAE lab. Supported tools include VNC and SSH. Packages installed include Octave, Pro-E and LabView.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Schools/SMME/Departments/RIME/About%20Department/Lab%20Facilities/PublishingImages/robotic%20lab%202.jpg")]),
        new builder.ThumbnailCard(session)
        .title(' Industrial Automation Lab')
        .text('Equipments Denford CIM System(CNC Slant Bed Lathe,Denford CNC 3-Axis Millin etc),PLC trainer with LCD display,PLC trainer with programmer etc helps students to perform their tasks.')
        .images([builder.CardImage.create(session, "https://5.imimg.com/data5/UG/VG/MY-5228790/plc-based-industrial-automation-lab-set-up-500x500.jpg")]),
        new builder.ThumbnailCard(session)
        .title('Robotics and Control Lab')
        .text('This lab is reserved for designing and testing of robots.Softwares are also available for robot designing.')
        .images([builder.CardImage.create(session, "https://www.ece.ncsu.edu/research_info/images/areas/crm.jpg")]),
        new builder.ThumbnailCard(session)
        .title('Project Lab')
        .text('Main activities of this lab are Final Year Projects.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Departments/CE/About%20Department/Lab%20Facilities/PublishingImages/LAB%204-2.jpg")]),
    ]
}
//
function Mechanical_Labs(session)
{

}
function CEME_Departments(session)
{
    return[
         new builder.ThumbnailCard(session)
        .title('Department of Computer Engineering')
        //.tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/ASAB/AP/ug/BSAB/Pages/Course-Curriculum.aspx"))
        .text('Computer Engineering is the practice of putting software and hardware to practical use. If you are interested in designing and fabricating of microprocessor based systems/controllers/circuits and developing result-oriented high quality software that work for the benefit of civil & defense establishments or people, then you should surely consider joining Department of Computer Engineering')
        .images([builder.CardImage.create(session, "http://2.bp.blogspot.com/-nK_ngdp9Yww/VaAto4F5IkI/AAAAAAAAATg/youbJ7ueP6E/s1600/11358748_829616633795061_1975661421_n.jpg")]),
         new builder.ThumbnailCard(session)
        .title('Department of Electrical Engineering')
        //.tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/ASAB/AP/ug/BSAB/Pages/Course-Curriculum.aspx"))
        .text('Electrical Engineering Department envision to impart quality education at undergraduate and Post- graduate levels to imbue a life-long quest for inquiry, reasoned analysis and for creating solutions to address the requirements of our society.The Department has elaborate plans to introduce new undergraduate streams in Electrical Engineering, majoring in Electrical power generation & Distribution, Biomedical Engineering, Intelligent Systems, and Nano-technologies. The Physical infrastructure, i. e. our Post-graduate Labs etc, will also be strengthened in due course.')
        .images([builder.CardImage.create(session, "http://1.bp.blogspot.com/-3NASHN4ac_M/VaAtod_LylI/AAAAAAAAATU/ZoyRZXOQ3z8/s1600/11426134_829616667128391_20664052_o.jpg")]),
         new builder.ThumbnailCard(session)
        .title('Department of Mechanical Engineering')
        //.tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/ASAB/AP/ug/BSAB/Pages/Course-Curriculum.aspx"))
        .text('At the Department of Mechanical Engineering, we are conscious of the fact that Mechanical Engineering, as a discipline, is the traditional bed-rock of engineering. It is thus all-encompassing, based on well-established laws of nature which are used through ingenuity to design and operate functional products. These products can be basic, such as pulleys and gears; conventional, such as engines and power-producing systems; or advanced, such as control and automation systems for vehicles and machinery.')
        .images([builder.CardImage.create(session, "http://2.bp.blogspot.com/-orzJ7GW9VOs/VaAtlVZj5VI/AAAAAAAAATM/-R548CloalE/s1600/11426624_829616673795057_395810521_n.jpg")]),
         new builder.ThumbnailCard(session)
        .title('Department of Mechatronics Engineering')
        //.tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/ASAB/AP/ug/BSAB/Pages/Course-Curriculum.aspx"))
        .text('Mechatronics refers to a flexible, multi-technological approach for integration of mechanical engineering, computer engineering, electronics and information sciences. Mechatronics is essential in the design of intelligent products. It allows engineers to transform their virtual concepts into real life applications. It is a relatively new concept relating to the design of systems, devices and products aimed at achieving an optimal balance between basic mechanical structure and its overall control. The programme involves research and coursework that will push the frontiers of technology in intelligent product design and development. The research activities involve design and control of intelligent robotic systems and automated machines. Modern state-of-the-art industries have changed rapidly from pure mechanical-, manufacturing-, and process-controlled type to electro-mechanical, fully automated and computerised. It has become the requirement for people working on those processes and production lines to have knowledge of all the related systems.')
        .images([builder.CardImage.create(session, "http://4.bp.blogspot.com/-7bB_c0HiuK8/VaAto8IpSKI/AAAAAAAAATY/Rx_8z-9PnCA/s1600/1470862_829616660461725_147257535_n.jpg")]),
         new builder.ThumbnailCard(session)
        .title('Department of Engineering Management')
        //.tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/ASAB/AP/ug/BSAB/Pages/Course-Curriculum.aspx"))
        .text('Department of Engineering Management at the College of E&ME provide an opportunity to graduate engineers to prepare themselves with latest principles and techniques of management of a technical enterprise through MS and PhD programs.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Campus-Life/PublishingImages/Campus%20Life%205.jpg")]),
         new builder.ThumbnailCard(session)
        .title('Department of Basics Sciences & Humanities')
        //.tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Schools/ASAB/AP/ug/BSAB/Pages/Course-Curriculum.aspx"))
        .text('Basic Sciences and Humanities department aims to provide a comprehensive knowledge of Mathematics, Engineering Physics, Chemistry, Pakistan Studies and Religious Studies to the engineering students. The courses offered by the department cover about one fourth of the Engineering Curriculum. The syllabus has been designed to enrich the students’ understanding towards the subjects with a view to helping them in encountering practical problems in their engineering careers. There is an emphasis on motivating the concepts with the aid of good examples and exercises, keeping a balance between applications and the basic principles behind them.')
        .images([builder.CardImage.create(session, "http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/Campus-Life/PublishingImages/Campus%20Life%201.jpg")]),
    ]
}
//
function EME_UG_DCE_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Computer Engineers')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/ug/BCE/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME to Computer Engineers at Undergraduate level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_UG_DEE_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Electrical Engineers')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/ug/BEE/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Undergraduate level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_UG_DME_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Mechanical Engineers')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/ug/BE%20Mechanical%20Engineering%202015/Pages/Course-Curriculum-for-2015-and-onword.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Undergraduate level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_UG_Mts_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Mechatronics Engineers')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/ug/BMacE/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Undergraduate level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_PG_Phd_Mts_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Master & Phd Mechatronics Engineering')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/pg/MS-phd-MechEngg/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Postgraduate and Phd level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_PG_Phd_CE_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Master & Phd Computer Engineering')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/pg/ms--phd-ce/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME to Computer Engineers at Postgraduate and Phd level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_PG_Phd_ME_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Master & Phd Mechanical Engineering')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/pg/ms-phd-me/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Postgraduate and Phd level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_PG_Phd_EE_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Master & Phd Electrical Engineering')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/pg/ms--phd-ee-cs/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Postgraduate and Phd level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_PG_Phd_EM_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Master & Phd in Engineering Management')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/pg/MS-phd-EM/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Postgraduate and Phd level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//
function EME_PG_Phd_CSE_Course(session)
{
     return[
        new builder.ThumbnailCard(session)
        .title('Course Curriculum for Master & Phd Computer Software Engineering')
        .tap(new builder.CardAction.openUrl(session,"http://www.nust.edu.pk/INSTITUTIONS/Colleges/CEME/ap/pg/ms-phd-cse/Pages/Course-Curriculum.aspx"))
        .text('Just click to get a list of courses offered by NUST CEME at Postgraduate and Phd level.There may be some variations in the subjects offered in each semester.')
        .images([builder.CardImage.create(session, "https://www.bcbe.org/cms/lib/AL01901374/Centricity/Domain/466/curriculum%20images.jpg")]),
        ]
}
//==========================================================================
// Tweet Coding
//==========================================================================

bot.dialog('tweets',[
   function(session,args,next){
       session.dialogData.profile=args ||{};
       var params;
        if (!session.dialogData.profile.params){
            builder.Prompts.text(session,"What would you like to know using Twitter?");
        } else {
            next();
        }},
function(session,results,next){
    if (results.response){
        //session.dialogData.profile.params=results.response;   
        }
   var params= {q: results.response,
    count: 15}
        T.get('search/tweets',params, gotdata);
            function gotdata (err, data, response) 
            {
               var tweet = data.statuses;
                for(var i=0; i < tweet.length; i++)
                {
               session.send(tweet[i].text);
               var k=sentimentAnalysis(tweet[i].text);
               var j=0;
                j=j+k;
               session.send(String(k));
               
                }
               if(j>0){
                   session.send('Trend is Positive')
               }
               if(j<0){
                   session.send('Trend is negative')
               }
               else{
                   session.send('Insufficient Information on Twitter')
               }
            
            }
   session.endDialog();
}
]).triggerAction({
    matches:'tweets'
})