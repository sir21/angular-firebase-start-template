import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogSuccess } from 'src/app/core/models/dialog-message';

@Component({
  selector: 'app-sign-up-success',
  templateUrl: './sign-up-success.component.html',
  styleUrls: ['./sign-up-success.component.scss']
})
export class SignUpSuccessComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SignUpSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogSuccess
  ) { }

  ngOnInit(): void {
  }

}
