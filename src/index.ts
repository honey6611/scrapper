import axios from 'axios';
import cheerio from 'cheerio';

interface Recipe {
  title: string;
  ingredients:  { amount: string, description: string }[];
}


async function getRecipeData(url: string): Promise<Recipe> {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  //document.querySelector("div[class='ingredient-section ingredient-section-1'] div:nth-child(1) span:nth-child(2) p:nth-child(1)")
  const title = $('h1').text().trim();
  // const ingredients = $("div[class='ingredient-section ingredient-section-1'] span.ingredient-description p")
  //   .map((_, el) => $(el).text().trim())
  //   .get();
    const ingredients: { amount: string, description: string }[] = [];
    $('.ingredient-item').map((_, el) => {
      const $el = $(el);
      const amount = $el.find('.ingredient-amount').text().trim().replace(/\n\t+/g, "");;
      const description = $el.find('.ingredient-description').text().trim();
      ingredients.push({ amount, description });
    });  
  return { title, ingredients };
  

}

async function scrapeRecipeWebsites(urls: string[]): Promise<Recipe[]> {
  const recipePromises = urls.map(getRecipeData);
  const recipes = await Promise.all(recipePromises);
  return recipes;
}

const urls = [
  'https://www.delish.com/uk/cooking/recipes/a29572279/toad-in-the-hole/',
  'https://www.delish.com/uk/cooking/recipes/a30219265/creamy-shrimp-linguine-tomatoes-kale-lemon-zest-recipe/',
];

scrapeRecipeWebsites(urls).then((recipes) => {
  console.log(JSON.stringify(recipes, null, 2));


});
