import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit{
  
  allProfilePictures = ['profile-pic.png', 'profile-pic-default.png', 'profile-squirrel.png', 'profile-ghost.png'];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) { }
  
  ngOnInit(): void {

  }
}
