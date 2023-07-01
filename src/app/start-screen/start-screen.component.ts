import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {
  game: any;

  constructor(private firestore: Firestore, private router: Router) { }

  ngOnInit(): void {
  }

  newGame() {
    // Start game
    let game = new Game();
    const GamesCollection = collection(this.firestore, 'games')
    addDoc(GamesCollection, game.toJson())
    .then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }
}

