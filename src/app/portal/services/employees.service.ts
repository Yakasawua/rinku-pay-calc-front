import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class EmployeesService {
    apiURL: string = `${environment.apiURL}/employees/`
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
    constructor(private http: HttpClient) {}

    employees() {
        return this.http.get(`${this.apiURL}list/`);
    }

    addEmployee(data:any) {
        return this.http.post(`${this.apiURL}create/`, data, this.httpOptions);
    }
}