import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'environments/environment';
import { DataService } from 'app/services/data.service';
import { TreeNode } from 'app/tree-node';

@Injectable()
export class PlannerService {

  public useExpensiveRecipes$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public timeFactor$: BehaviorSubject<number> = new BehaviorSubject(1); // 1 || 1/60 || 1/3600 (set set by output node)
  public sharedResources = [];

  public virtualDiagram = new Subject<void>();
  public virtualTree = {};
  private virtualTreePointer = 0

  constructor(
    private dataService: DataService,
  ) {
    if (!environment.production) { console.log('constructor'); }
    this.useExpensiveRecipes$.subscribe();
    this.timeFactor$.subscribe(() => {
      this.calculateTreeNodes();
    });
  }

  public logInfo() {
    console.log(this.virtualTree);
  }

  private computeSharedResources() {
    console.log('computing shared resources');
    this.sharedResources = [];
    for (const key in this.virtualTree) {
      if (this.virtualTree.hasOwnProperty(key)) {
        this.virtualTree[key].getSharedResources();
      }
    }
    for (const key in this.sharedResources) {
      if (this.sharedResources.hasOwnProperty(key)) {
        this.sharedResources.push({ name: key, throughput: this.sharedResources[key] });
      }
    }
  }

  public addSharedResource(name: string, throughput: number) {
    if (name === 'Item') { return; }
    if (this.sharedResources[name]) {
      this.sharedResources[name] += throughput;
    } else {
      this.sharedResources[name] = throughput;
    }
  }

  public createInMemoryTree(recipeName: string, recipeRequest: number = 1) {
    console.log('creating in-memory tree for', recipeName, recipeRequest);
    this.virtualTree = {};
    this.virtualTreePointer++;
    const idRootNode = this.virtualTreePointer;
    const rootNode = new TreeNode(this, recipeName, recipeRequest);
    this.processTreeNode(rootNode);
    this.calculateTreeNodes();
    return idRootNode;
  }

  public calculateTreeNodes() {
    for (const key in this.virtualTree) {
      if (this.virtualTree.hasOwnProperty(key)) {
        const node = this.virtualTree[key];
        node.calculate();
      }
    }
    this.computeSharedResources();
  }

  private getRecipe(name: string) {
    return this.dataService.recipesObject[name] ? this.dataService.recipesObject[name] : null;
  }

  private processTreeNode(node: TreeNode, parentId?: number): number {
    // console.log('processing tree node', node);
    node.recipe = this.getRecipe(node.name);
    node.quantityPerCraft = this.getQuantityPerCraft(node.recipe);
    node.category = this.getCraftingCategory(node.recipe);
    node.craftingTime = this.getCraftingTime(node.recipe);
    this.virtualTree[this.virtualTreePointer] = node;
    const nodeId = this.virtualTreePointer;
    this.virtualTreePointer++;
    // console.log('node', node.name, 'id', nodeId);
    const ingredients = this.getIngredients(node);
    // console.log('ingredients', ingredients);
    ingredients.forEach(ingredient => {
      let childNode: TreeNode;
      if (Array.isArray(ingredient)) { // type 1 - array
        childNode = new TreeNode(this, ingredient[0]); // [0]:name, [1]:amount
        childNode.recipeRequest = ingredient[1];
      } else { // type 2 - object
        childNode = new TreeNode(this, ingredient.name); // name, amount
        childNode.recipeRequest = ingredient.amount;
      }
      childNode.idParent = nodeId;
      node.childsIds.push(this.processTreeNode(childNode));
    });
    node.machines = this.getCraftingMachines(node.category, ingredients.length);
    node.craftingMachine = node.machines[0] || null;
    return nodeId;
  }

  private getIngredients(node: TreeNode): any[] {
    if (!node.recipe) { return []; }
    let ingredients: any[] = [];
    if (node.recipe.expensive && this.useExpensiveRecipes$.value) { // expensive
      if (node.recipe.expensive.ingredients) { ingredients = node.recipe.expensive.ingredients; }
      // console.log('using expensive recipe', node.recipe.name, ingredients);
    } else if (node.recipe.normal) { // normal
      if (node.recipe.normal.ingredients) { ingredients = node.recipe.normal.ingredients; }
    } else { // basic
      if (node.recipe.ingredients) { ingredients = node.recipe.ingredients; }
    }
    return ingredients;
  }

  private getQuantityPerCraft(recipe): number {
    const quantityPerCraft = 1;
    if (!recipe) { return quantityPerCraft; }
    if (recipe.products) { return recipe.products[0].amount; }
    return quantityPerCraft;
  }

  private getCraftingCategory(recipe): string {
    let category = 'unknown';
    if (!recipe) { return category; }
    if (recipe.category) { category = recipe.category; }
    return category;
  }

  private getCraftingTime(recipe): number {
    let craftingTime = .5;
    if (!recipe) { return craftingTime; }
    if (recipe.energy) { craftingTime = recipe.energy; }
    return craftingTime;
  }

  private getCraftingMachines(craftingCategory: string, numIngredients): any[] {
    const machines = this.dataService.getAssemblingMachinesByCategory(craftingCategory, numIngredients);
    return machines;
  }

}
