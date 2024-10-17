const { fetchTopics, fetchTopicByName } = require('../models/topics.models')

exports.getTopics = (req,res,next) => {
    
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}


