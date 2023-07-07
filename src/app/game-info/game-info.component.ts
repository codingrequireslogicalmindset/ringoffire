import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnChanges {
  cardAction = [
    { title: 'Waterfall', description: 'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player 2 may stop drinking, and so on.' },
    { title: 'You', description: 'You decide who drinks!' },
    { title: 'Me', description: 'Congrats! Drink a shot!' },
    { title: 'Category', description: 'Come up with a category (e.g. Colors). Each player must enumerate one item from the category.' },
    { title: 'Bust a Jive', description: 'Player 1 makes a dance move. Player 2 repeats the dance move and adds a second one.' },
    { title: 'Chicks', description: 'All girls drink!' },
    { title: 'Heaven', description: 'Put your hands up! The last player drinks!' },
    { title: 'Mate', description: 'Pick a mate! Your mate must always drink when you drink and the other way around!' },
    { title: 'Thumbmaster', description: 'This means you put your thumb on the table and the last person to do so drinks.' },
    { title: 'Men', description: 'All men drink!' },
    { title: 'Quizmaster', description: 'Ask questions; those who answer will drink' },
    { title: 'Never Have I Ever...', description: 'Say something you never did. Everyone who did it has to drink.' },
    { title: 'Rulemaster', description: 'Make a rule. Everyone needs to drink when he breaks the rule.' },
  ];

  title = '';
  description = '';
  @Input() card: string;

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    if(this.card) {
      console.log('Current card is:', this.card);
      let cardNumber = +this.card.split('_')[1];
      this.title = this.cardAction[cardNumber -1].title;
      this.description = this.cardAction[cardNumber -1].description;
    }
  }
}
