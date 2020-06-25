import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  userSubs = new Subscription();
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService) {
    }
    
  ngOnInit() {
    this.userSubs = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }
}
