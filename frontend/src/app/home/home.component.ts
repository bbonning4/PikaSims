import { Component } from '@angular/core';
import { Pokemon } from '../models/pokemon-model';
import { HttpClient } from '@angular/common/http';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  selectedPokemon1: string = '';
  selectedPokemon2: string = '';
  
  constructor(private pokemonService: PokemonService) {}

  pokemonList = this.pokemonService.getPokemonList();

  simulateBattle() {
    if (this.selectedPokemon1 && this.selectedPokemon2) {
      this.pokemonService.getPokemonData(this.pokemonList[this.selectedPokemon1]).subscribe(pokemon1 => {
        this.pokemonService.getPokemonData(this.pokemonList[this.selectedPokemon2]).subscribe(pokemon2 => {
            const pokemon1_statTotal = pokemon1.stats.reduce((a: any, b: { base_stat: any; }) => a + b.base_stat, 0);
            const pokemon2_statTotal = pokemon2.stats.reduce((a: any, b: { base_stat: any; }) => a + b.base_stat, 0);
            if (pokemon1_statTotal > pokemon2_statTotal) {
              console.log(`${pokemon1.name} wins!`)
            } else if (pokemon2_statTotal > pokemon1_statTotal) {
              console.log(`${pokemon2.name} wins!`)
            } else {
              console.log("It's a draw!")
            }
        });
      });
    }
  }

}
