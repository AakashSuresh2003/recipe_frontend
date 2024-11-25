import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecipeManager.css";

const RecipeManager = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    recipeId: "",
    name: "",
    cuisine: "",
    category: "",
    ingredients: "",
    chef: "",
    status: "Available",
  });
  const [editMode, setEditMode] = useState(false); // To track edit mode
  const [editRecipeId, setEditRecipeId] = useState(null); // To store recipeId of the recipe being edited

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  const handleAddOrUpdateRecipe = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // Update recipe
        const response = await axios.put(
          `http://localhost:5001/api/v1/recipes/${editRecipeId}`,
          {
            ...newRecipe,
            ingredients: newRecipe.ingredients.split(","),
          }
        );
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.recipeId === editRecipeId ? response.data.recipe : recipe
          )
        );
        alert("Recipe updated successfully!");
      } else {
        // Add new recipe
        const response = await axios.post(
          "http://localhost:5001/api/v1/recipes",
          {
            ...newRecipe,
            ingredients: newRecipe.ingredients.split(","),
          }
        );
        setRecipes([...recipes, response.data.recipe]);
        alert("Recipe added successfully!");
      }
      setNewRecipe({
        recipeId: "",
        name: "",
        cuisine: "",
        category: "",
        ingredients: "",
        chef: "",
        status: "Available",
      });
      setEditMode(false);
      setEditRecipeId(null);
    } catch (error) {
      console.error(
        editMode ? "Error updating recipe:" : "Error adding recipe:",
        error
      );
    }
  };

  const handleDelete = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5001/api/v1/recipes/${recipeId}`);
      setRecipes(recipes.filter((recipe) => recipe.recipeId !== recipeId));
      alert("Recipe deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  const handleEdit = (recipe) => {
    setEditMode(true);
    setEditRecipeId(recipe.recipeId);
    setNewRecipe({
      recipeId: recipe.recipeId,
      name: recipe.name,
      cuisine: recipe.cuisine,
      category: recipe.category,
      ingredients: recipe.ingredients.join(", "),
      chef: recipe.chef,
      status: recipe.status,
    });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/recipes/search?name=${searchQuery}`
      );

      if (response.data.length === 0) {
        setRecipes([]);
        alert("No data found for the given search criteria.");
      } else {
        setRecipes(response.data);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      alert("An error occurred while searching. Please try again.");
    }
  };

  return (
    <div className="recipe-manager">
      <h1>Recipe Management App</h1>

      <div className="add-recipe">
        <h2>{editMode ? "Edit Recipe" : "Add New Recipe"}</h2>
        <form onSubmit={handleAddOrUpdateRecipe}>
          <input
            type="text"
            placeholder="Recipe ID"
            value={newRecipe.recipeId}
            onChange={(e) => setNewRecipe({ ...newRecipe, recipeId: e.target.value })}
            required
            disabled={editMode} // Disable Recipe ID input during edit
          />
          <input
            type="text"
            placeholder="Name"
            value={newRecipe.name}
            onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cuisine"
            value={newRecipe.cuisine}
            onChange={(e) => setNewRecipe({ ...newRecipe, cuisine: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newRecipe.category}
            onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Ingredients (comma-separated)"
            value={newRecipe.ingredients}
            onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Chef"
            value={newRecipe.chef}
            onChange={(e) => setNewRecipe({ ...newRecipe, chef: e.target.value })}
            required
          />
          <select
            value={newRecipe.status}
            onChange={(e) => setNewRecipe({ ...newRecipe, status: e.target.value })}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <button type="submit">{editMode ? "Update Recipe" : "Add Recipe"}</button>
        </form>
      </div>

      <div className="search-recipes">
        <h2>Search Recipes</h2>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="all-recipes">
        <h2>All Recipes</h2>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.recipeId} className="recipe-card">
              <h3>{recipe.name}</h3>
              <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
              <p><strong>Category:</strong> {recipe.category}</p>
              <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
              <p><strong>Chef:</strong> {recipe.chef}</p>
              <p><strong>Status:</strong> {recipe.status}</p>
              <button onClick={() => handleEdit(recipe)}>Edit</button>
              <button onClick={() => handleDelete(recipe.recipeId)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeManager;
