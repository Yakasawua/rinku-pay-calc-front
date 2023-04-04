import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './portal.component';
import { EmployeesComponent } from './containers/employees/employees.component';
import { EmployeesFormComponent } from './containers/employees-form/employees-form.component';
import { PayrollComponent } from './containers/payroll/payroll.component';

const routes: Routes = [
    {
        path: '',
        component: PortalComponent,
        children: [
            //Employees
            {path: 'employees', component: EmployeesComponent},
            {path: 'employees/:id', component: EmployeesFormComponent},
            //Payroll
            {path: 'payroll', component: PayrollComponent},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PortalRoutingModule {}