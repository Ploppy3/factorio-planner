import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PlannerService {
  
  public $useExpensiveRecipes: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.$useExpensiveRecipes.subscribe();
  }

}
