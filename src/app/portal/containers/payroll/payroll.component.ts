import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { PayrollService } from '../../services/payroll.service';

declare var $: any;

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective|undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();
  cleanTable: Boolean = false;

  payroll_list: any;
  payroll_id: number | null = null;
  apiUrl: string = environment.apiURL;
  data: any = {};

  formattedDate: string | null;

  constructor(
    private payroll: PayrollService,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { 
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json',
      },
    };
    const today = new Date();
    this.formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.get_payroll_list();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_payroll_list(){
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
    this.data['month_year'] = this.formattedDate;
    this.payroll.payrollByMonthAndYear(JSON.stringify(this.data)).subscribe(
      (res) => {
        this.payroll_list = res;
        if ((res as Array<any>).length != 0) {
          this.dtTrigger.next(res);
          this.cleanTable = true;
        }
        $.unblockUI();
      },
      (error) => {
        if (error['status'] == 401) {
          this.router.navigateByUrl('/portal/dashboard');
          this.toastr.warning('Hubo un error.');
        } else {
          this.toastr.error('Error: ' + error);
        }
        $.unblockUI();
      }
    );
  }

  onDateChange(event: any) {
    const selectedDate = event.value;
    this.formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    this.get_payroll_list_date();
  }

  get_payroll_list_date(){
    if ((this.dtElement && this.dtElement.dtInstance) && this.cleanTable) {
      this.cleanTable = false;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
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
    this.data['month_year'] = this.formattedDate;
    this.payroll.payrollByMonthAndYear(JSON.stringify(this.data)).subscribe(
      (res) => {
        this.payroll_list = res;
        if ((res as Array<any>).length != 0) {
          this.dtTrigger.next(res);
          this.cleanTable = true;
        }
        $.unblockUI();
      },
      (error) => {
        if (error['status'] == 401) {
          this.router.navigateByUrl('/portal/dashboard');
          this.toastr.warning('Hubo un error.');
        } else {
          this.toastr.error('Error: ' + error);
        }
        $.unblockUI();
      }
    );
  }

  set_payroll_id(id: number) {
    this.payroll_id = id;
  }

}
