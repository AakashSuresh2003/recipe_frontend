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

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/recipes",
        {
          ...newRecipe,
          ingredients: newRecipe.ingredients.split(","),
        }
      );
      setRecipes([...recipes, response.data.recipe]);
      alert("Recipe added successfully!");
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
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
        <h2>Add New Recipe</h2>
        <form onSubmit={handleAddRecipe}>
          <input
            type="text"
            placeholder="Recipe ID"
            value={newRecipe.recipeId}
            onChange={(e) => setNewRecipe({ ...newRecipe, recipeId: e.target.value })}
            required
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
          <button type="submit">Add Recipe</button>
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
