import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    
  }

  newGame() {
  this.router.navigateByUrl('/game');
  }

 
  

}

