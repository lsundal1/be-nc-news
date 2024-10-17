const { removeComment, updateCommentVotes } = require('../models/comments.models')

exports.deleteComment = (req,res,next) => {

    const { comment_id } = req.params

    removeComment(comment_id).then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.patchCommentVotes = (req, res, next) => {

    const { comment_id } = req.params
    const { inc_votes } = req.body

    updateCommentVotes(comment_id, inc_votes).then((updatedComment) => {
        res.status(200).send({updatedComment})
    })
    .catch(next)
}