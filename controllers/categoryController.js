const Category = require("../models/categoryModel");
const { ObjectId } = require("mongodb");

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.session.user.id;

  if (!name || name.trim() === "") {
    return res.redirect("/settings?error=Podaj nazwę kategorii");
  }

  try {
    await Category.create({ name, userId: new ObjectId(userId) });
    res.redirect("/settings?success=Dodano kategorię");
  } catch (error) {
    console.error("Błąd podczas tworzenia kategorii:", error);
    res.redirect("/settings?error=Nie udało się dodać kategorii");
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.body;

  try {
    await Category.deleteById(id);
    res.redirect("/settings?success=Usunięto kategorię");
  } catch (error) {
    console.error("Błąd podczas usuwania kategorii:", error);
    res.redirect("/settings?error=Nie udało się usunąć kategorii");
  }
};

exports.getUserCategories = async (userId) => {
  try {
    return await Category.findByUserId(new ObjectId(userId));
  } catch (error) {
    console.error("Błąd podczas pobierania kategorii użytkownika:", error);
    return [];
  }
};
