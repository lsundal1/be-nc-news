const { fetchTopics, fetchTopic } = require('../models/topics.models')

exports.getTopics = (req,res,next) => {
    
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

exports.getTopic = (req,res,next) => {

    const { topic_name } = req.params

    fetchTopic(topic_name).then((topic) => {
        res.status(200).send({topic})
    })
    .catch(next)
}


