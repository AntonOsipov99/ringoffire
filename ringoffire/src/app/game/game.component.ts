import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, addDoc, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})


export class GameComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  pickCardAnimation = false;
  currentCard: string = '';
  gameId!: any;
  stackEmpty: boolean = false;
  game: Game = new Game();
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];
      onSnapshot(
        doc(this.getGamesRef(), params['id']),
        (doc: any) => {
          let gameData = doc.data();
          console.log('Game update', this.game)
          this.game.currentPlayer = gameData.currentPlayer;
          this.game.playedCards = gameData.playedCard;
          this.game.players = gameData.players;
          this.game.stack = gameData.stack;
        }
      );
    });
  }

  newGame() {
    this.game = new Game();
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: any) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  takeCard() {
    if (this.game.stack.length > 0) {
        if (this.game.players.length < 2) {
            this.openDialog();
        } else {
            if (!this.pickCardAnimation) {
                this.currentCard = this.game.stack.pop() ?? '';
                this.pickCardAnimation = true;
                this.saveGame();
                this.game.currentPlayer++;
                this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
                if (this.game.playedCards === undefined) {
                    this.game.playedCards = [];
                }
                setTimeout(() => {
                    this.game.playedCards.push(this.currentCard);
                    this.pickCardAnimation = false;
                    this.saveGame();
                }, 800);
            }
        }
    } else {
        this.stackEmpty = true;
    }
}


  async saveGame() {
    const gameData: any = this.game.toJson();
    if (gameData.playedCards === undefined) {
      gameData.playedCards = [];
    }
    const firebaseData = doc(this.firestore, 'games', `${this.gameId}`);
    await updateDoc(firebaseData, {
      players: gameData.players,
      stack: gameData.stack,
      playedCards: gameData.playedCards,
      currentPlayer: gameData.currentPlayer,
      pickCardAnimation: gameData.pickCardAnimation,
      currentCard: gameData.currentCard,
    });
  }
}