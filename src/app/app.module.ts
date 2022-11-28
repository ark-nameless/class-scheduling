import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './views/pages/pages.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UnAuthorizedInterceptor } from './interceptors/un-authorized.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,


    PagesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnAuthorizedInterceptor, 
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
