const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags

  try {
    const allTags = await Tag.findAll({
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
    });

    if (!allTags) {
      return res.status(404).json({
        error: "There are no tags right now",
      });
    }
    return res.status(200).json(allTags);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Sorry, could not get tags. Please try again later." });
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`

  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, {
      include: [
        { model: Product, attributes: ["product_name", "price", "stock"] },
      ],
    });
    if (!tag) {
      return res
        .status(404)
        .json({ message: "Tag has not been found with this id" });
    }
    return res.status(200).json(tag);
  } catch (error) {
    return res.status(500).json({ error: "Sorry, we could not get tag info." });
  }
});

// create a new tag
router.post("/", async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ message: "Sorry, unable to create tag" });
    }

    const newTag = await Tag.create({ tag_name });

    return res
      .status(200)
      .json({ message: "Tag has been successfully created", tag: newTag });
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, unable to create a new tag. Please try again later.",
    });
  }
});

// update a tag's name by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag does not exist",
      });
    }

    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ message: "Sorry, unable to update tag" });
    }
    await Tag.update(
      { tag_name },
      {
        where: { id },
      }
    );

    return res.status(200).json({ message: "Tag has been updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Sorry, we could not update your tag." });
  }
});

// delete on tag by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag does not exist",
      });
    }

    await Tag.destroy({ where: { id } });
    return res.status(200).json({ message: "Tag is now deleted" });
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, unable to delete the tag. Please try again later.",
    });
  }
});

module.exports = router;
