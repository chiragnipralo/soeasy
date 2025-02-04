import { Injectable } from '@angular/core';
import { CanLoad, Router,Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor( public dataservice: DataService,private router: Router) { 
  }
  
  async canLoad(): Promise<boolean>{
    const hasSeenIntro = await this.dataservice.getItem(INTRO_KEY);
    console.log(typeof hasSeenIntro)
    if (hasSeenIntro && (hasSeenIntro === 'true')) {
      return true;
    } else {
      this.router.navigateByUrl('/welcome', { replaceUrl:true });
      return false;
    }
  }
}
