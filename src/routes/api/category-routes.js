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
    console.error(`ERROR | ${error.message}`);
    return res
      .status(500)
      .json({
        error: "Sorry, could not get categories. Please try again later.",
      });
  }
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post("/", (req, res) => {
  // create a new category
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
