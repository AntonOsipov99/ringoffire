import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {
  constructor(private firestore: Firestore, private router: Router) { }

  ngOnInit(): void {

  }

  newGame() {
    let game = new Game();
    addDoc(this.getGamesRef(), game.toJson()).then((gameInfo: any) => {
      this.router.navigateByUrl('/game/' + gameInfo.id);
    });
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }




}

