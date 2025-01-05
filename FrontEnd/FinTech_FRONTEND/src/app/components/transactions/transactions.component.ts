import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/side-bar/side-bar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TransactionService } from '@services/transaction-normale.service';

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
    // 'Crypto Transfer', 
    'Payment', 
    'Deposit'
  ];

  transactionSuccess = false; // Indique si la transaction a réussi
  transactionError = false; // Indique si une erreur s'est produite

  constructor(private fb: FormBuilder, private transactionService: TransactionService) {
    this.transactionForm = this.fb.group({
      transaction_type: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      recipient: ['', Validators.required],
      destination_address: ['', Validators.required] // Added destination_address
    });
  }

  ngOnInit(): void {
    console.log('TransactionsComponent loaded');
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;
      console.log('Transaction Data Sent:', transactionData); // Vérifiez les données ici
      this.transactionService.addTransaction(transactionData).subscribe({
        next: (response) => {
          console.log('Transaction Successful:', response);
          this.transactionSuccess = true;
          this.transactionForm.reset();
          setTimeout(() => (this.transactionSuccess = false), 3000);
        },
        error: (error) => {
          console.error('Transaction Failed:', error);
          this.transactionError = true;
          setTimeout(() => (this.transactionError = false), 3000);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
