const express = require("express");

const router = express.Router();

const userSchema = require("../schema/user")

router.get('', (req, res) => {
    res.send("Welcome to API test Website");
})

router.get('/items', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const startIndex = (page - 1) * limit;

        const results = await userSchema.find()
            .skip(startIndex)
            .limit(limit)
            .exec();

        const totalItems = await userSchema.countDocuments();

        res.json({
            results,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            totalItems
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('', async (req, res) => {
    try{
        const data = req.body;
        console.log(data);

        const newData  = new userSchema(data)

        await newData.save();
        res.status(200).json({message: "Everything is fine"});
    }
    catch(err){
        console.log(`There is an error ${err}`);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
})

router.patch('', async(req, res) => {
    try{
        const id = req.query.id;
        console.log(id);

        const data = req.body;
        console.log(data);

        const response = await userSchema.findByIdAndUpdate(id, data, {new:true});

        if(!response){
            return res.status(404).send("Book Id is missing");
        }
        res.status(200).json({response});
    }
    catch(err){
        console.log(`There is an error ${err}`);
        res.status(500).json({ message: "An error occurred", error: err.message });

    }
})

router.delete('', async(req, res) => {
    try{
        const id = req.query.id;
        console.log(id);

        const response = await userSchema.findByIdAndDelete(id);

        if(!response){
            return res.status(404).send("Book Id is missing");
        }
        res.status(200).json({response});
    }
    catch(err){
        console.log(`There is an error ${err}`);
        res.status(500).json({ message: "An error occurred", error: err.message });

    }
})

module.exports = router;