import { AuthComponent } from './../../auth/components/auth/auth.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [],
  imports: [AuthComponent],
  exports: [AuthComponent]
})
export class AuthModule { }