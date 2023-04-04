import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { EmployeesService } from '../../services/employees.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective|undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  employees_list: any;
  employee_id: number | null = null;
  employee_name: string | null = null;
  employee_number: string | null = null;
  employee_role: string | null = null;
  apiUrl: string = environment.apiURL;
  data: any = {};

  employee_roles: Choice[] = [
    { value: 'CH', viewValue: 'Chofer'},
    { value: 'CA', viewValue: 'Cargador'},
    { value: 'AU', viewValue: 'Auxiliar'},
  ];

  constructor(
    private employees: EmployeesService,
    private router: Router,
    private toastr: ToastrService
  ) { 
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json',
      },
    };
  }

  ngOnInit(): void {
    this.get_employees_list();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  get_employees_list(){
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
    this.employees.employees().subscribe(
      (res) => {
        console.log(res);
        this.employees_list = res;
        this.dtTrigger.next(res);
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

  set_employee_data(id: number, name: string, employee_number: string, role: string) {
    this.employee_id = id;
    this.employee_name = name;
    this.employee_number = employee_number;
    this.employee_role = role;
  }

}
