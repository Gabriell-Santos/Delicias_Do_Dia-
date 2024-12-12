const form = document.querySelector(".search-form");
const recipeList = document.querySelector(".recipe-list");
const input = document.querySelector(".search-input");
const recipeDetails = document.querySelector(".recipe-details");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputValue = event.target[0].value;
  searchRecipe(inputValue);
});

async function searchRecipe(ingredients) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
    );

    const data = await response.json();
    ShowRecipe(data.meals);
  } catch (err) {
    recipeList.innerHTML = `<p> Nenhuma receita encontrada </P>`;
  }
}

function ShowRecipe(recipe) {
  recipeList.innerHTML = recipe
    .map(
      (
        item
      ) => `<div class="recipe-card" onclick="getRecipeDetails(${item.idMeal} )">
        <img src="${item.strMealThumb}" alt="recipe-image">
        <h3>${item.strMeal}</h3>
        </div>`
    )
    .join("");
}

async function getRecipeDetails(id) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await response.json();
  const recipe = data.meals[0];

  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients += `<li>${recipe[`strIngredient${i}`]} - ${
        recipe[`strMeasure${i}`]
      }</li>`;
    } else {
      break;
    }
  }

  const strTags = recipe.strTags ? recipe.strTags.split(",").join(", ") : "N/A";

  recipeDetails.innerHTML = `
      <h2>${recipe.strMeal}</h2>
      <img src="${recipe.strMealThumb}" class="recipe-img" alt="Imagem da Receita">
      <h3>Categoria: ${recipe.strCategory}</h3>
      <h3>Origem: ${recipe.strArea}</h3>
      <h3>Ingredientes:</h3>
      <ul>${ingredients}</ul>
      <h3>Instruções:</h3>
      <p>${recipe.strInstructions}</p>
      <p>Tags: ${strTags}</p>
      <h3>Vídeo:</h3>
      <p><a href="${recipe.strYoutube}" target="_blank">Assista no Youtube</a></p>
    `;
}
