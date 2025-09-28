const pool = require("../models/item.model");

exports.getItems = (req, res) => {
    pool.query("SELECT * FROM items", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

exports.addItem = (req, res) => {
    const { name, description } = req.body;
    pool.query(
        "INSERT INTO items (name, description) VALUES (?, ?)",
        [name, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Item added", id: result.insertId });
        }
    );
};
