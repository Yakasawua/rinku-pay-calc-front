import { Component, Input, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { PayrollService } from '../../services/payroll.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-payroll-form',
  templateUrl: './payroll-form.component.html',
  styleUrls: ['./payroll-form.component.css']
})
export class PayrollFormComponent implements OnInit {
  @Input() props!: {
    employee_id: number | null, employee_name: string | null, employee_number: string | null,
    employee_role: string | null
  };
  @ViewChild('modal_payroll') modal_payroll!: ElementRef;
  @ViewChild('buttonClose') buttonClose!: ElementRef;

  payroll_form = new FormGroup({
    month: new FormControl('', [Validators.required]),
    deliveries: new FormControl('', [
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$'),
    ]),
    worked_hours: new FormControl('', [
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  id: string | null = null;
  payroll_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  formattedDate: string | null;

  employee_roles: Choice[] = [
    { value: 'CH', viewValue: 'Chofer'},
    { value: 'CA', viewValue: 'Cargador'},
    { value: 'AU', viewValue: 'Auxiliar'},
  ];

  constructor(
    private payroll: PayrollService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private datePipe: DatePipe
  ) {
    this.renderer.listen('window', 'click', (e: Event) =>{
      if (this.modal_payroll && e.target === this.modal_payroll.nativeElement) {
        this.clear();
      }
    });
    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    $.blockUI({
      message: '<i class="icon-spinner4 spinner"></i>',
      overlayCSS: {
        backgroundColor: '#1b2024',
        opacity: 0.8,
        zIndex: 1200,
        cursor: 'wait',
      },
      css: {
        border: 0,
        color: '#fff',
        padding: 0,
        zIndex: 1201,
        backgroundColor: 'transparent',
      },
    });

    $.unblockUI();
  }

  save_payroll() {
    this.data['employee_id'] = this.props.employee_id;
    this.data['month'] = this.formattedDate;
    this.data['deliveries'] = (this.payroll_form.get('deliveries') as FormControl).value;
    this.data['worked_hours'] = (this.payroll_form.get('worked_hours') as FormControl).value;

    $.blockUI({
      message: '<i class="icon-spinner4 spinner"></i>',
      overlayCSS: {
        backgroundColor: '#1b2024',
        opacity: 0.8,
        zIndex: 1200,
        cursor: 'wait',
      },
      css: {
        border: 0,
        color: '#fff',
        padding: 0,
        zIndex: 1201,
        backgroundColor: 'transparent',
      },
    });

    this.payroll.addPayroll(JSON.stringify(this.data)).subscribe(
      (res:any) => {
        $.unblockUI();
        //this.router.navigateByUrl('/portal/payroll');
        this.toastr.success('Nomina del mes agregada correctamente.');
      },
      (error:any) => {
        console.log(error);
        let errors = error['error'];
        for (let e in errors) {
          this.toastr.error(errors[e], 'Error!');
        }
        $.unblockUI();
      }
    );
    this.click_button_clear();
  }

  clear(){
    (this.payroll_form.get('month') as FormControl).setValue('');
    (this.payroll_form.get('deliveries') as FormControl).setValue('');
    (this.payroll_form.get('worked_hours') as FormControl).setValue('');
  }

  click_button_clear(){
    let el: HTMLElement = this.buttonClose.nativeElement;
    el.click();
  }

  onDateChange(event: any) {
    const selectedDate = event.value;
    this.formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    (this.payroll_form.get('month') as FormControl).setValue(this.formattedDate);
  }

}
