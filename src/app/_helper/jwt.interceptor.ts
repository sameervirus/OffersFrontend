import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services/authentication.service';
const apiUrl = `${environment.mainUrl}`;

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith(apiUrl);
    if (isLoggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentUser.token}`,
        },
        url: `${environment.mainUrl}/${request.url}`,
      });
    }

    return next.handle(request);
  }
}
