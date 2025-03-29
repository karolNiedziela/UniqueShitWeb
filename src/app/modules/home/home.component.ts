import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Sterowanie widocznością dodatkowych okienek
  showTextWindow1: boolean = true;
  showTextWindow2: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Usunięto logikę dotyczącą logowania – event listener’y nie są już potrzebne.
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }
}
