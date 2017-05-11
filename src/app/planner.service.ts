import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataService } from "./data.service";
import { Node } from "./node";

@Injectable()
export class PlannerService {
  
  public useExpensiveRecipes$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public timeFactor$: BehaviorSubject<number> = new BehaviorSubject(1); // 1 || 1/60 || 1/3600 (set set by output node)
  public sharedResources: {} = {};

  constructor(
    private dataService: DataService,
  ) {
    console.log('constructor');
    this.useExpensiveRecipes$.subscribe();
    this.timeFactor$.subscribe();
  }

  public addSharedResource(name: string, throughput: number) {
    if (name == 'Item') return;
    if (this.sharedResources[name])
      this.sharedResources[name] += throughput;
    else
      this.sharedResources[name] = throughput;
    //console.log(this.sharedResources);
  }

  public resetSharedRessources() {
    this.sharedResources = [];
  }

}

interface preprocessedNode{
  name: string;
  
}