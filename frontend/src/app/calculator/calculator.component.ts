import { Component } from '@angular/core';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-calculator',
  templateUrl: './dmgcalc/index.html',
  styleUrls: [
    './calculator.component.css',
    "./dmgcalc/select2/select2.css",
    "./dmgcalc/shared_controls.css",
    "./dmgcalc/bootstrap.css",
    "./dmgcalc/ap_calc.css",
    "./dmgcalc/pikalytics_calc_styles.css",

  ]
})
export class CalculatorComponent {
  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: any
  ) { }

  ngOnInit() {
    const jquery1 = this.renderer2.createElement('script');
    jquery1.type = 'text/javascript';
    jquery1.src = "./assets/js/jquery-1.9.1.min.js";
    jquery1.onload = this.loadProduction1.bind(this);
    this.renderer2.appendChild(this._document.body, jquery1);

  }

  loadProduction1() {
    const production = this.renderer2.createElement('script');
    production.type = 'text/javascript';
    production.src = "node_modules/@pikalytics/calc/dist/data/production.min.js";
    // production.src = "assets/production.min.js";
    production.onload = this.loadProduction2.bind(this);
    this.renderer2.appendChild(this._document.body, production);
  }

  loadProduction2() {
    const production2 = this.renderer2.createElement('script');
    production2.type = 'text/javascript';
    production2.src = "~/@pikalytics/calc/dist/production.min.js";
    // production2.src = "assets/production.min.js";
    production2.onload = this.loadScripts.bind(this);
    this.renderer2.appendChild(this._document.body, production2);
  }

  loadScripts() {
    const switch_mode = this.renderer2.createElement('script');
    switch_mode.type = 'text/javascript';
    switch_mode.src = "./assets/js/switch_mode.js";
    // switch_mode.onload = () => {
    //   console.log("switch mode loaded")
    // }
    this.renderer2.appendChild(this._document.body, switch_mode);

    const select2 = this.renderer2.createElement('script');
    select2.type = 'text/javascript';
    select2.src = "./assets/js/select2.min.js";
    // select2.onload = () => {
    //   console.log("select2 loaded")
    // }
    this.renderer2.appendChild(this._document.body, select2);

    
    const pokedex = this.renderer2.createElement('script');
    pokedex.type = 'text/javascript';
    pokedex.src = "./assets/js/pokedex.js";
    // pokedex.onload = () => {
    //   console.log("pokedex loaded")
    // }
    this.renderer2.appendChild(this._document.body, pokedex);
    
    const setdex1 = this.renderer2.createElement('script');
    setdex1.type = 'text/javascript';
    setdex1.src = "./assets/js/setdex_pikalytics_v22.js";
    // setdex1.onload = () => {
    //   console.log("setdex v22 loaded")
    // }
    this.renderer2.appendChild(this._document.body, setdex1);
    
    const setdex2 = this.renderer2.createElement('script');
    setdex2.type = 'text/javascript';
    setdex2.src = "./assets/js/setdex_pikalytics_ou_v6.js";
    // setdex2.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, setdex2);
    
    const setdex3 = this.renderer2.createElement('script');
    setdex3.type = 'text/javascript';
    setdex3.src = "./assets/js/setdex_ss.js?v=1";
    setdex3.id = "SSScript";
    // setdex3.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, setdex3);
    
    const stat_data = this.renderer2.createElement('script');
    stat_data.type = 'text/javascript';
    stat_data.src = "./assets/js/stat_data.js";
    // stat_data.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, stat_data);
    
    const type_data = this.renderer2.createElement('script');
    type_data.type = 'text/javascript';
    type_data.src = "./assets/js/type_data.js";
    // type_data.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, type_data);
    
    const nature_data = this.renderer2.createElement('script');
    nature_data.type = 'text/javascript';
    nature_data.src = "./assets/js/nature_data.js";
    // nature_data.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, nature_data);
    
    const ability_data = this.renderer2.createElement('script');
    ability_data.type = 'text/javascript';
    ability_data.src = "./assets/js/ability_data.js";
    // ability_data.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, ability_data);
    
    const item_data = this.renderer2.createElement('script');
    item_data.type = 'text/javascript';
    item_data.src = "./assets/js/item_data.js";
    // item_data.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, item_data);
    
    const move_data = this.renderer2.createElement('script');
    move_data.type = 'text/javascript';
    move_data.src = "./assets/js/move_data.js";
    // move_data.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, move_data);
    
    const damage = this.renderer2.createElement('script');
    damage.type = 'text/javascript';
    damage.src = "./assets/js/damage.js";
    // damage.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, damage);
    
    const ap_calc = this.renderer2.createElement('script');
    ap_calc.type = 'text/javascript';
    ap_calc.src = "./assets/js/ap_calc.js?v=9";
    // ap_calc.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, ap_calc);
    
    const survcalc = this.renderer2.createElement('script');
    survcalc.type = 'text/javascript';
    survcalc.src = "./assets/js/survcalc.js?v=1";
    // survcalc.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, survcalc);
    
    const ko_chance = this.renderer2.createElement('script');
    ko_chance.type = 'text/javascript';
    ko_chance.src = "./assets/js/ko_chance.js";
    // ko_chance.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, ko_chance);
    
    const setdex = this.renderer2.createElement('script');
    setdex.type = 'text/javascript';
    setdex.src = "./assets/js/setdex_custom_v2.js";
    // setdex.onload = () => {
      
    // }
    this.renderer2.appendChild(this._document.body, setdex);
  }

}
