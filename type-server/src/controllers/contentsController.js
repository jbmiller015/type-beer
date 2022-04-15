const mongoose = require("mongoose");


exports.contents_sub_delete = async (req, res) => {
    const _id = req.params.sub;
    const Object = mongoose.model('Beer');


    let processList = []
    const processes = await mongoose.model("Process").find({
        userId: req.user._id,
    });

    if (processes.length > 0) {
        for (let i = 0; i < processes.length; i++) {
            if (processes[i].contents.toString().localeCompare(_id) === 0) {
                processList.push(processes[i].name)
            }
        }
    }

    try {
        if (processList.length > 0) {
            res.status(422).send(`Cannot Delete This Beer.\nThis Beer in use by the following processes: ${processList.toString().replace(/,/g, ', ')}`)
        } else {
            await Object.findOneAndDelete({_id}, {useFindAndModify: false});
            res.send({deleted: _id});
        }

    } catch (e) {
        res.status(422).send(e.message);
    }
}
