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
  gameId!: any;
  stackEmpty: boolean = false;
  game: Game = new Game();
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      onSnapshot(
        doc(this.getGamesRef(), params['id']),
        (doc: any) => {
          let gameData = doc.data();
          this.game.currentPlayer = gameData.currentPlayer;
          this.game.playedCards = gameData.playedCards;
          this.game.players = gameData.players;
          this.game.stack = gameData.stack;
          this.game.pickCardAnimation = gameData.pickCardAnimation;
          this.game.currentCard = gameData.currentCard;
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
            if (!this.game.pickCardAnimation) {
                this.game.currentCard = this.game.stack.pop() ?? '';
                this.game.pickCardAnimation = true;
                this.game.currentPlayer++;
                this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
                this.saveGame();
                setTimeout(() => {
                    this.game.playedCards.push(this.game.currentCard);
                    this.game.pickCardAnimation = false;
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