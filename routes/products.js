const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');

// Configuration de la base de données (à adapter selon votre configuration)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'commerce'
});

// Configuration de Multer pour gérer les uploads d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/images';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir); // Dossier où enregistrer les images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);  // Nom unique de l'image
    }
});

const upload = multer({ storage: storage });

// Route pour récupérer les produits avec filtres et tri
router.get('/', (req, res) => {
    const { category, subcategory, sort } = req.query;  // Récupérer les paramètres de filtrage et tri depuis la requête
    let getProductsQuery = `
        SELECT id, name, description, price, stock, image_name_1, category_id, subcategory_id
        FROM products
    `;
    const conditions = [];
    const params = [];

    // Ajouter des conditions de filtre
    if (category) {
        conditions.push('category_id = ?');
        params.push(category);
    }

    if (subcategory) {
        conditions.push('subcategory_id = ?');
        params.push(subcategory);
    }

    if (conditions.length > 0) {
        getProductsQuery += ' WHERE ' + conditions.join(' AND ');
    }

    // Ajouter une condition de tri
    if (sort) {
        if (sort === 'price_asc') {
            getProductsQuery += ' ORDER BY price ASC';
        } else if (sort === 'price_desc') {
            getProductsQuery += ' ORDER BY price DESC';
        } else if (sort === 'name_asc') {
            getProductsQuery += ' ORDER BY name ASC';
        } else if (sort === 'name_desc') {
            getProductsQuery += ' ORDER BY name DESC';
        }
    }

    // Exécuter la requête
    db.query(getProductsQuery, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ products: results });
    });
});

// Exporter le router pour l'utiliser dans l'application
module.exports = router;

// Route pour récupérer les statistiques de commandes
router.get('/order-stats', (req, res) => {
    const query = `
        SELECT DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date, COUNT(*) AS order_count
        FROM orders
        WHERE order_date IS NOT NULL
        GROUP BY DATE(order_date)
        ORDER BY order_date ASC;
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ error: 'Erreur interne du serveur lors de la récupération des statistiques de commandes.' });
        }

        if (!results || results.length === 0) {
            console.log('Aucune donnée de commande trouvée.');
            return res.status(404).json({ message: 'Aucune statistique de commande trouvée.' });
        }

        const dates = results.map(row => row.order_date);
        const orderCounts = results.map(row => row.order_count);

        res.json({ dates, orderCounts });
    });
});

// Route pour mettre à jour le stock
router.post('/update-stock', (req, res) => {
    const { productId, stockChange } = req.body;

    if (typeof stockChange !== 'number' || stockChange === 0) {
        return res.status(400).json({ success: false, message: 'La modification du stock doit être un nombre valide non nul.' });
    }

    const updateStockQuery = `
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
    `;

    db.query(updateStockQuery, [stockChange, productId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du stock :', err.message);
            return res.status(500).json({ error: 'Erreur interne du serveur lors de la mise à jour du stock.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
        }

        return res.json({ success: true, message: 'Stock mis à jour avec succès.' });
    });
});

// Route pour récupérer toutes les catégories
router.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des catégories:', err);
            return res.status(500).json({ error: 'Erreur interne du serveur lors de la récupération des catégories.' });
        }
        res.json({ categories: results });
    });
});

// Route pour obtenir toutes les sous-catégories
router.get('/subcategories', (req, res) => {
    const query = 'SELECT * FROM subcategories';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur interne du serveur lors de la récupération des sous-catégories.' });
        }
        res.json({ subcategories: results });
    });
});

// Route pour ajouter un nouveau produit
router.post('/add', upload.single('image'), (req, res) => {
    const { name, description, price, stock, category_id, subcategory_id } = req.body;
    const imageName = req.file ? req.file.filename : null; // Récupérer le nom de fichier généré par multer

    // Vérifiez que tous les champs requis sont présents
    if (!name || !description || !price || !stock || !category_id || !subcategory_id) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    // Vérification du prix et du stock (si nécessaire)
    if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ success: false, message: 'Le prix et le stock doivent être des valeurs numériques valides.' });
    }

    // Insérer le nouveau produit dans la base de données, y compris le nom du fichier image
    const query = 'INSERT INTO products (name, description, price, stock, category_id, subcategory_id, image_name_1) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, description, price, stock, category_id, subcategory_id, imageName], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout du produit:', err);
            return res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout du produit.' });
        }
        res.json({ success: true, message: 'Produit ajouté avec succès.' });
    });
});

// Route pour supprimer un produit
router.post('/delete', (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ success: false, message: 'L\'ID du produit est requis.' });
    }

    const deleteQuery = 'DELETE FROM products WHERE id = ?';

    db.query(deleteQuery, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur interne du serveur lors de la suppression du produit.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Produit non trouvé.' });
        }

        res.json({ success: true, message: 'Produit supprimé avec succès.' });
    });
});

// Route pour obtenir les détails d'un produit par son ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    const query = `SELECT * FROM products WHERE id = ?`;

    db.query(query, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }
        if (results.length > 0) {
            res.json({ product: results[0] });
        } else {
            res.status(404).json({ message: 'Produit non trouvé' });
        }
    });
});

// Route pour mettre à jour le nom, la description et l'image d'un produit
router.post('/update', (req, res) => {
    const { id, name, description, category_id, subcategory_id, price } = req.body;

    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        if (results.length > 0) {
            const oldProduct = results[0];
            const oldImageName = oldProduct.image_name_1;
            const newImageName = oldImageName ? oldImageName.replace(oldProduct.name, name) : `${name}.jpg`;

            // Mise à jour du produit et gestion du renommage d'image
            const query = `
                UPDATE products 
                SET name = ?, description = ?, image_name_1 = ?, category_id = ?, subcategory_id = ?, price = ? 
                WHERE id = ?
            `;

            db.query(query, [name, description, newImageName, category_id, subcategory_id, price, id], (err, results) => {
                if (err) {
                    console.error('Erreur SQL:', err);
                    return res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du produit' });
                }

                // Renommage du fichier d'image local si nécessaire
                if (oldImageName && oldImageName !== newImageName && fs.existsSync(`./public/images/${oldImageName}`)) {
                    console.log('Renommage de l\'image:', oldImageName, 'vers', newImageName);
                    fs.renameSync(`./public/images/${oldImageName}`, `./public/images/${newImageName}`);
                }

                res.json({ success: true, message: 'Produit mis à jour avec succès.' });
            });
        } else {
            res.status(404).json({ message: 'Produit non trouvé' });
        }
    });
});

// Route pour ajouter une nouvelle catégorie
router.post('/categories/add', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: 'Le nom de la catégorie est requis.' });
    }

    const query = 'INSERT INTO categories (categories_name) VALUES (?)';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de la catégorie:', err);
            return res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout de la catégorie.' });
        }
        res.json({ success: true, message: 'Catégorie ajoutée avec succès.' });
    });
});

// Route pour mettre à jour l'image d'un produit
router.post('/update-image', upload.single('image'), (req, res) => {
    const { productId } = req.body;

    // Vérification du fichier téléchargé
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Erreur lors du téléchargement de l\'image.' });
    }

    const newImageName = req.file.originalname; // Utilisation du nom d'origine du fichier

    // Obtenir le produit existant pour vérifier l'image
    const query = `SELECT * FROM products WHERE id = ?`;
    db.query(query, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }

        if (results.length > 0) {
            const oldProduct = results[0];
            const oldImageName = oldProduct.image_name_1;

            // Suppression de l'ancienne image si elle existe et a changé
            if (oldImageName && oldImageName !== newImageName && fs.existsSync(`./public/images/${oldImageName}`)) {
                fs.unlinkSync(`./public/images/${oldImageName}`);
            }

            // Mise à jour du nom de l'image dans la base de données
            const updateQuery = `UPDATE products SET image_name_1 = ? WHERE id = ?`;
            db.query(updateQuery, [newImageName, productId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'image.' });
                }
                res.json({ success: true, newImageName });
            });
        } else {
            res.status(404).json({ message: 'Produit non trouvé' });
        }
    });
});

module.exports = router;
