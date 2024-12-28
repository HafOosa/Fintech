import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/side-bar/side-bar.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
      recipient: ['', Validators.required],
      destination_address: ['', Validators.required] // Added destination_address
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.transactionForm.valid) {
      // Submit transaction logic
      console.log('Transaction Data:', this.transactionForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
