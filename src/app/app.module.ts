import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Plugins
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';

// Services
import { JwtInterceptor, ErrorInterceptor } from './_helper';

import { AppComponent } from './app.component';
import { BootstrapToast } from './components/toasterCustom.component';

@NgModule({
  declarations: [AppComponent, BootstrapToast],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      toastComponent: BootstrapToast,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [BootstrapToast],
})
export class AppModule {}
