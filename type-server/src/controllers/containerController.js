const mongoose = require("mongoose");


exports.container_sub_delete = async (req, res) => {
    const _id = req.params.sub;
    const Object = mongoose.model('Tank');


    let processList = []
    const processes = await mongoose.model("Process").find({
        userId: req.user._id,
    });

    if (processes.length > 0) {
        for (let i = 0; i < processes.length; i++) {
            for (let le of processes[i].phases) {
                if (le.startTank.toString().localeCompare(_id) === 0 || le.endTank.toString().localeCompare(_id) === 0) {
                    if (!processList.includes(processes[i].name))
                        processList.push(processes[i].name)
                }
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
