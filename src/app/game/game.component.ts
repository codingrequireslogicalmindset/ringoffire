import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { Unsubscribe } from 'firebase/auth';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  games$: Observable<any[]>;
  pickCardAnimation = false;
  currentCard: string ='';
  game: Game;
  gameId: string;
  gameDoc: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { 
    const GamesCollection = collection(this.firestore, 'games')
    this.games$ = collectionData(GamesCollection);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params);
      this.gameId = params['id']; // Die ID aus den Route-Parametern erhalten
      const gameDoc = doc(this.firestore, 'games', this.gameId);
      
      let gameSubscription: Unsubscribe;
      
      gameSubscription = onSnapshot(gameDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const game = docSnapshot.data();
          console.log('Game update', game);
          // Spielattribute aktualisieren
          this.game.currentPlayer = game['currentPlayer'];
          this.game.playedCards = game['playedCards'];
          this.game.players = game['players'];
          this.game.stack = game['stack'];
          this.game.pickCardAnimation = game['pickCardAnimation'];
          this.game.currentCard = game['currentCard'];
        }
      });
      // Wenn du das Spiel nicht mehr beobachten möchtest, kannst du das Abonnement beenden:
      // gameSubscription.unsubscribe();
    });
  }
  
  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      console.log('New card: ' + this.game.currentCard);
      console.log('Game is', this.game);
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    const gameDoc: any = doc(this.firestore, 'games', this.gameId);
    const gameData = this.game.toJson();
    updateDoc(gameDoc, gameData);
  }
};
