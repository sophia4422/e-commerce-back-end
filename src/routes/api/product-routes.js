const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products
  try {
    const allProducts = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });

    if (!allProducts) {
      return res.status(404).json({
        error: "There are no products right now",
      });
    }
    return res.status(200).json(allProducts);
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, could not get products. Please try again later.",
    });
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product has not been found with this id" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Sorry, we could not get product info." });
  }
});

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product does not exist",
      });
    }

    await Product.destroy({ where: { id } });
    return res.status(200).json({ message: "Product is now deleted" });
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, unable to delete the product. Please try again later.",
    });
  }
});

module.exports = router;
