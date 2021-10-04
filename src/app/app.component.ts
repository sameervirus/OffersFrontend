import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthenticationService } from './_services/authentication.service';
import { IToastButton } from './components/toasterCustom.component';

import { Offer } from './_models/Offer';
import { OffersService } from './_services/offers.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  p: number = 1;
  login = { email: '', password: '' };
  logedIn = false;
  formDiv = false;
  formTitle = 'Add Request';
  model = new Offer(0, '', '', '', '', '', '', '', '', '');
  workScope = ['Fabrication', 'Erection', 'Fabrication & Erection'];
  offers: Offer[] = [];
  originalOffers: Offer[] = [];
  editStatus = false;

  toastRef: Subscription = new Subscription();
  toastButtons: IToastButton[] = [
    {
      id: '1',
      title: 'Yes',
    },
    {
      id: '2',
      title: 'No',
    },
  ];

  _currentUser: any;

  constructor(
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private offersService: OffersService
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    if (isLoggedIn) {
      this.logedIn = true;
      this._currentUser = currentUser;
    }
  }

  ngOnInit() {
    this.getOffers();
  }

  onLogin() {
    this.authenticationService
      .login(this.login.email, this.login.password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getOffers();
          this.logedIn = true;
          this.toastr.success("You're logged in!", 'Success');
        },
        error: (error) => {
          console.log(error);
          this.toastr.error(error.error, 'Error');
        },
      });
  }

  getOffers(): void {
    if (this.logedIn)
      this.offersService.getOffers().subscribe((res) => {
        this.offers = res;
        this.originalOffers = res;
      });
  }

  onSearchChange(e: any) {
    console.log(this.originalOffers);
    let str = e.target.value;
    this.offers = this.originalOffers.filter(
      (a: Offer) =>
        a.client.toLowerCase().includes(str.toLowerCase()) ||
        a.work_type.toLowerCase().includes(str.toLowerCase()) ||
        a.project_name.toLowerCase().includes(str.toLowerCase())
    );
  }

  onSubmit(): void {
    this.offersService.addOffer(this.model, this.editStatus).subscribe(
      (res) => {
        this.toastr.success('Request done successfuly', 'Great!');
        if (this.editStatus === false) this.offers.push(res);
        this.formDiv = false;
      },
      (err) => {
        this.toastr.error(err.message, 'Error');
      }
    );
  }

  newOffer(): void {
    this.editStatus = false;
    this.formDiv = true;
    this.model = new Offer(0, '', '', '', '', '', '', '', '', '');
  }

  editOffer(offer: Offer): void {
    this.editStatus = true;
    this.model = offer;
    this.formDiv = true;
  }

  deleteOffer(offer: Offer) {
    this.toastRef = this.toastr
      .info('Are you sure you want delete item?', 'Warning', {
        disableTimeOut: true,
        // tapToDismiss: false,
        // toastClass: 'toast border-red',
        closeButton: true,
        // positionClass: 'bottom-left',
        // @ts-ignore
        buttons: this.toastButtons,
      })
      .onAction.subscribe((x) => {
        if (x.id === '1') {
          this.offersService.deleteOffer(offer).subscribe(
            (res) => {
              this.toastr.success('Item Deleted successfuly', 'Great!');
              this.offers.splice(this.offers.indexOf(offer), 1);
            },
            (err) => {
              this.toastr.error(err.message, 'Error');
            }
          );
        }
        this.toastr.clear();
      });
  }

  assignNo(offer: Offer) {
    const code = this._currentUser.id == 1 ? 'QU' : 'FQU';
    this.offersService.getCode(code, offer.id).subscribe(
      (res) => {
        this.toastr.success('Item updated successfuly', 'Great!');
        this.offers[this.offers.indexOf(offer)] = res;
      },
      (err) => {
        this.toastr.error(err.message, 'Error');
      }
    );
  }
}
