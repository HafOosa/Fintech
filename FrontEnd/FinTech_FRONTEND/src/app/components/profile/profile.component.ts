import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user = {
    name: 'John Doe',
    username: 'johndoe123',
    email: 'johndoe@example.com',
    phone: '+123456789',
    address: '123 Main Street, City, Country',
    profileImage: '/user.png',
    memberSince: new Date('2020-01-01'),
  };

  editProfile() {
    alert('Edit profile functionality goes here!');
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
      alert('Account deletion functionality goes here!');
    }
  }
}
