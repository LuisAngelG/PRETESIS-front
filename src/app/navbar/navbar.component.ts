import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  currentUser: any

  isLoggedIn = false
  username?: string

  constructor(private storageService: StorageService, private authService:AuthService) { }

  ngOnInit(): void {
      this.currentUser = this.storageService.getUser()
      this.isLoggedIn = this.storageService.isLoggedIn()

    if(this.isLoggedIn){
      const user = this.storageService.getUser()

      this.username = user.username
    }
  }

  logout():void {
    this.authService.loguot().subscribe({
      next: res => {
        console.log(res)
        this.storageService.clean()

        window.location.reload()
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
