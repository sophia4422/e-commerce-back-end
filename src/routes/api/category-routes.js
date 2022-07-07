const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const allCategories = await Category.findAll({
      include: [
        {
          model: Product,
          attributes: ["product_name", "price", "stock"],
        },
      ],
    });
    //if there are no categories, return res status 404
    if (!allCategories) {
      return res.status(404).json({ message: "No categories found" });
    }
    return res.status(200).json(allCategories);
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, could not get categories. Please try again later.",
    });
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category has not been found with this id." });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Sorry, we could not get category info." });
  }
});

// create a new category
router.post("/", (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "Sorry, unable to create a category" });
    }

    const newCategory = await Category.create({ category_name });

    return res.status(200).json({ message: "A new tag has been successfully created", category: newCategory 
  });
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, unable to create a new category. Please try again later.",
    });
  }
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
