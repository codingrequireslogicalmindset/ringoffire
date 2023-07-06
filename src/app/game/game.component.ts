import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { doc, updateDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

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
  player_images: any;
  gameOver = false;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params);
      this.gameId = params['id']; // Die ID aus den Route-Parametern erhalten
      const gamesCollectionRef = collection(this.firestore, 'games')
      const docRef = doc(gamesCollectionRef, this.gameId);
      docData(docRef).subscribe(game => {
        this.game.currentPlayer = game['currentPlayer'];
        this.game.playedCards = game['playedCards'];
        this.game.players = game['players'];
        this.game.player_images = game['player_images'];
        this.game.stack = game['stack'];
        this.game.pickCardAnimation = game['pickCardAnimation'];
        this.game.currentCard = game['currentCard'];
      })
    });
  }
  
  newGame() {
    this.game = new Game();
  }

  takeCardValid() {
    if (this.game.players.length < 2) {
      alert('Select at least two players, before you start the game!');
    } else {
      this.takeCard();
    }
  }  

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation && this.game.players.length >= 2) {
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

  editPlayer(playerId: number) {
    console.log('Edit player', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Received Change', change);
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('profile-squirrel.png');
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
