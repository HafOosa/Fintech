import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../side-bar/side-bar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,SidebarComponent,HeaderComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  transactionForm: FormGroup;
  transactionTypes = [
    'Bank Transfer', 
    'Crypto Transfer', 
    'Payment', 
    'Deposit'
  ];

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      recipient: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.transactionForm.valid) {
      // Submit transaction logic
      console.log(this.transactionForm.value);
    }
  }
}