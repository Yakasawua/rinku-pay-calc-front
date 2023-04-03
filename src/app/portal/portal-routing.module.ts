import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalComponent } from './portal.component';
import { EmployeesComponent } from './containers/employees/employees.component';

const routes: Routes = [
    {
        path: '',
        component: PortalComponent,
        children: [
            //Employees
            {path: 'employees', component: EmployeesComponent},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PortalRoutingModule {}