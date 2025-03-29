const express = require("express");

const router = express.Router();

const db = require("../schema/user")

router.get('', (req, res) => {
    res.send("Welcome to API test Website");
})

router.get('/items', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const resultsQuery = await db.query('SELECT * FROM items ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);

        const countQuery = await db.query('SELECT COUNT(*) FROM items');

        const totalItems = parseInt(countQuery.rows[0].count);

        res.json({
            results : resultsQuery.rows,
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

        const newData  = await db.query('INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *', [data.name, data.description])

        res.status(201).json(data);
    }
    catch(err){
        console.log(`There is an error ${err}`);
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
})

router.patch('', async(req, res) => {
    try{
        const id = req.query.id;

        const data = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID parameter is required in URL" });
        }
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Request body cannot be empty" });
        }

        const setClause = Object.keys(data)
        .map((key, i) => `${key} = $${i+1}`)
        .join(', ');

        const values = Object.values(data);
        values.push(id);

        const updateQuery = `
            UPDATE items
            SET ${setClause}
            where id = $${values.length}
            RETURNING *
        `;

        const response = await db.query(updateQuery, values);

        if(response.rows.length === 0){
            return res.status(404).json({ message: "Item not found with the given ID" });
        }

        res.status(200).json({
            message: "Item updated successfully",
            updatedItem: response.rows[0]
        });
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

        const response = await db.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);

        if(response.rows.length === 0){
            return res.status(404).send("User is not found");
        }
        res.status(200).json({message: "User deleted"});
    }
    catch(err){
        console.log(`There is an error ${err}`);
        res.status(500).json({ message: "An error occurred", error: err.message });

    }
})

module.exports = router;