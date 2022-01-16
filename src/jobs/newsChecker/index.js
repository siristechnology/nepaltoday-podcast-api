const { Article } = require("../../db-service/database/mongooseSchema")
const { getAllSources } = require("../../db-service/newsDbService")
const Mailgun = require('mailgun-js');
const logger = require("../../config/logger")

module.exports = async function(){
    try{
        const lastDay = new Date((new Date()).getTime() - 24 * 60 * 60 * 1000)
        for(const source of getAllSources()){
            const todayArticles = await Article.find({
                sourceName: source.sourceName,
                createdAt: { $gte: lastDay }
            })
            if(todayArticles.length==0){
                sendMail(source.sourceName)
            }       
        }
    }catch(error){
        logger.info("News checker error ", error)
    }
    logger.info("News checker job completed")
}

const sendMail = async (sourceName) => {
    try{
        const mailgunApiKey = process.env.MAILGUN_API_KEY
        const domain = process.env.MAILGUN_DOMAIN
        const from = 'shiva.siristechnology@gmail.com'

        const mailgun = new Mailgun({apiKey: mailgunApiKey, domain: domain});

        const data = {
            from,
            to: process.env.RECEIVER_MAILS,
            subject:  'Articles not being fetched from library through '+sourceName,
            text:  'Articles not being fetched from library through '+sourceName
        }
        await mailgun.messages().send(data)

    }catch(error){
        logger.info("Error while sending mail ",error)
    }
}