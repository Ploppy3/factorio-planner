import { DataService } from "./data.service";
import { PlannerService } from "./planner.service";

export class Node {  

  private recipe: any; //game recipe provided by the data service

  private useExpensive: boolean = false;
  public outputRate: number = 1;
  public name: string = 'Item';
  public recipeRequest: number = 1;
  public quantityPerCraft: number = 1;
  public craftingSpeed: number = .0;
  public craftingTime: number = .5;
  public numberMachines: number = 1;
  //public rate = 0;

  public parent: Node;  
  public childs: Node[] = [];
  //public attenuation: number = 1;
  public showOptions: boolean = false;
  public category: string = 'unknown'; // crafting, crafting-with-fluid, advanced-crafting, smelting, chemistry
  public machines: any[] = [];

  constructor(private dataService: DataService, private plannerService: PlannerService){}

  public calculate() { // small possible refresh
    //console.log('calculate', this.name);
    //this.attenuation = (this.recipeRequest / this.quantityPerCraft) * this.parent.attenuation;
    //this.numberMachines = this.craftingTime * (this.recipeRequest * this.parent.attenuation) / this.craftingSpeed / this.quantityPerCraft;
    this.outputRate = this.parent.outputRate / this.parent.quantityPerCraft * this.recipeRequest;
    this.numberMachines = this.outputRate / this.quantityPerCraft / ((1 * this.craftingSpeed) /  this.craftingTime);
    //this.rate = this.quantityPerCraft / this.craftingTime * this.craftingSpeed * this.numberMachines;
    //this.rate = 0;
    this.childs.forEach(node => {
      node.calculate();
    });
  }

  public refreshExpensiveRecipes(useExpensive: boolean) {
    this.useExpensive = useExpensive;
    this.childs.forEach(node => {
      node.refreshExpensiveRecipes(useExpensive);
    });
  }

  public initialize() {
    if (!this.recipe) { return; }
    //console.log(recipe);
    let ingredients: any[] = [];
    //-------------------------------
    if (this.recipe.category) {
      this.category = this.recipe.category;
    } else {
      this.category = 'crafting'; //default
    }
    this.quantityPerCraft = 1; // reset value (needed for root node only)
    let craftingTime_expensive: number = null;
    if (this.recipe.expensive && this.plannerService.useExpensiveRecipes$.value) { // expensive
      if (this.recipe.normal.ingredients) ingredients = this.recipe.expensive.ingredients;
      if (this.recipe.normal.energy_required) craftingTime_expensive = this.recipe.expensive.energy_required;
      //console.log('using expensive recipe', this.recipe.name);
    } else if (this.recipe.normal) { // normal
      if (this.recipe.normal.ingredients) ingredients = this.recipe.normal.ingredients;
      if (this.recipe.normal.energy_required) this.craftingTime = this.recipe.normal.energy_required;
    } else { // basic
      if (this.recipe.ingredients) ingredients = this.recipe.ingredients;
      if (this.recipe.energy_required) this.craftingTime = this.recipe.energy_required;
      if (this.recipe.result_count) this.quantityPerCraft = this.recipe.result_count;
    }
    if (this.recipe.results) {
      this.recipe.results.forEach(result => {
        if (result.name == this.recipe.name) {
          this.quantityPerCraft = result.amount;
        }
      });
    }
    let machines = this.dataService.getAssemblingMachinesByCategory(this.category, ingredients.length);
    this.machines = machines;
    if (machines.length > 0) {
      this.craftingSpeed = machines[0].crafting_speed;
      //console.log('using machine:', machines[0], 'for', recipe.name);
    } else {
      this.craftingSpeed = 0;
    }
    //-------------------------------
    this.calculate(); //do it here to prevent propagation of the calculate call to its children
    //-------------------------------
    ingredients.forEach(ingredient => {
      if (Array.isArray(ingredient)) { // type 1 - array
        this.addChild(ingredient[0], ingredient[1]);  // name, amount
      } else { // type 2 - object
        this.addChild(ingredient.name, ingredient.amount);
      }
    });
  }

  public findRecipeByName() { // starts a major refresh
    //console.log('searching recipe', this.name);
    this.childs = [];
    for (let i = 0; i < this.dataService.recipes.length; i++) {
      let recipe = this.dataService.recipes[i];
      if (recipe.name == this.name) {
        this.recipe = recipe;
        //console.log(recipe);
        this.initialize();
        return;
      }
    }
    this.category = 'unknown'; // reset for root node
    //console.log("can't find recipe for", this.name);
  }

  public addChild(name: string, recipeRequest: number) {
    let node = new Node(this.dataService, this.plannerService);
    node.parent = this;
    node.name = name
    node.recipeRequest = recipeRequest;
    //node.calculate();
    this.childs.push(node);
  }
}
