const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags

  try {
    const allTags = await Tag.findAll({
      include: [
        { model: Product, 
          attributes: ["product_name", "price", "stock"] },
      ],
    });
    if (!allTags) {
      return res.status(500).json({ message: "There are no tags" });
    }
    return res.json(allTags);
  } catch (error) {
    return res.status(500).json({error: "Sorry, could not get tags. Please try again later."});
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`

  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id, {
      include: [
        { model: Product, 
          attributes: ["product_name", "price", "stock"] },
      ],
    });
    if (!tag) {
      return res.status(404).json({ message: "Tag has not been found with this id" });
    }
    return res.status(200).json(tag);
  } catch (error) {
    return res.status(500).json({ error: });
  }
});

router.post('/', (req, res) => {
  // create a new tag
  try {
    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(400).json({ message: "Sorry, unable to create tag" });
    }
    const tag = await Tag.create(req.body);
    return res.status(200).json({ message: "Tag has been created", newTag: tag });
  } catch (error) {
    console.error(`ERROR | ${error.message}`);
    return res.status(500).json(error);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ message: "Tag is not found" });
    }

    const { tag_name } = req.body;
    if (!tag_name) {
      return res.status(500).json({ message: "Sorry, unable to update tag" });
    }
    await Tag.update({ tag_name }, { where: { id } });

    return res.status(200).json({ message: "Tag has been updated" });
  } catch (error) {
    console.error(`ERROR | ${error.message}`);
    return res.status(500).json(error);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);

    if (!tag) {
      return res.status(404).json({ message: "Tag is not found" });
    }

    await Tag.destroy({ where: { id } });
    return res.status(200).json({ message: "Tag is now deleted" });
  } catch (error) {
    console.error(`ERROR | ${error.message}`);
    return res.status(500).json(error);
  }
});

module.exports = router;
