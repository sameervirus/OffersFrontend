import { Component } from '@angular/core';

import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
export interface IToastButton {
  id: string;
  title: string;
}
@Component({
  selector: '[bootstrap-toast-component]',
  template: `
    <div class="">
      <button
        type="button"
        aria-label="Close"
        class="toast-close-button"
        *ngIf="options.closeButton"
        (click)="remove()"
      >
        <span aria-hidden="true">×</span>
      </button>
      <div class="toast-title" [attr.aria-label]="title || 'default header'">
        {{ title || 'default header' }}
      </div>

      <div
        role="alert"
        aria-live="polite"
        [attr.aria-label]="message"
        class="toast-message"
      >
        {{ message || 'default message' }}
      </div>
      <div *ngIf="buttons" class="mt-2 pt-2 border-top">
        <a
          *ngFor="let btn of buttons"
          class="btn btn-sm btn-dark"
          (click)="action($event, btn)"
        >
          {{ btn.title }}
        </a>
      </div>
    </div>
  `,
  preserveWhitespaces: false,
})
export class BootstrapToast extends Toast {
  buttons: any;
  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
  }

  ngOnInit() {
    /* @ts-ignore */
    this.buttons = this.options.buttons;
  }

  // Demo click handler
  action(event: Event, btn: any) {
    event.stopPropagation();
    this.toastPackage.triggerAction(btn);
    return false;
  }
}
