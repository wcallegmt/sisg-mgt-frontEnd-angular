import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor( private authService: AuthService, private router: Router ) { }

  canActivate(): Promise<boolean> {
    return new Promise( ( resolve) => {
      this.authService.onVerifyCredentials().subscribe( (res: any) => {
        if (!res.ok) {
          this.router.navigateByUrl('login');
          resolve(false);
        }
  
        resolve(true);

      });

    });

  }
  
}
