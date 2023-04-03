import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { EmployeesService } from '../../services/employees.service';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employees-form',
  templateUrl: './employees-form.component.html',
  styleUrls: ['./employees-form.component.css']
})
export class EmployeesFormComponent implements OnInit {
  employees_form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    employee_number: new FormControl('', [
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$'),
    ]),
    role: new FormControl(''),
  });

  form_type: string = '';
  id: string | null = null;
  employees_obj: any;
  apiURL: string = environment.apiURL;
  options: any;
  data: any = {};

  employee_roles: Choice[] = [
    { value: 'CH', viewValue: 'Chofer'},
    { value: 'CA', viewValue: 'Cargador'},
    { value: 'AU', viewValue: 'Auxiliar'},
  ];

  constructor(
    private employees: EmployeesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

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

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id == 'add') {
      this.form_type = 'Agregar';
    }
    $.unblockUI();
  }

  save_employees() {
    const formData = new FormData();
    formData.append('name', (this.employees_form.get('name') as FormControl).value);
    formData.append('employee_number', (this.employees_form.get('employee_number') as FormControl).value);
    formData.append('role', (this.employees_form.get('role') as FormControl).value);
    
    formData.forEach((value:any, key) => {
        this.data[key] = value;
    }); 

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

    if (this.form_type == 'Agregar') {
      this.employees.addEmployee(JSON.stringify(this.data)).subscribe(
        (res:any) => {
          $.unblockUI();
          this.router.navigateByUrl('/portal/employees');
          this.toastr.success('Empleado agregado correctamente.');
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
      
    } 
  }

}
