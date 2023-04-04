import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class PayrollService {
    apiURL: string = `${environment.apiURL}/payroll/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    payrollByMonthAndYear(data:any) {
        return this.http.post(`${this.apiURL}list_by_month_year/`, data, this.httpOptions);
    }

    addPayroll(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }
}