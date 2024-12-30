import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {

  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: ''
  }

  isEditing: boolean = false;

  errorMessage: string = "";

  constructor(private employeeService: EmployeeService,
              private router: Router,
              private route: ActivatedRoute
  ) { }

  ngOnInit() : void {
    this.route.paramMap.subscribe((result) => {
      result.get('id') ? this.isEditing = true : this.isEditing = false;
      if (this.isEditing) {
        const id = result.get('id');
        this.employeeService.getEmployeeById(Number(id)).subscribe({
          next: (result) => this.employee = result,
          error: (error) => this.errorMessage = `Error occurred: (Status: ${error.status})`
        });
      }
    });
  }

  onSubmit() : void {
    if (this.isEditing) {
      this.editEmployee();
    } else {
      this.createEmployee();
    }  
  }

  createEmployee() {
    this.employeeService.createEmployee(this.employee)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = `Error occurred: (Status: ${error.status})`;
        }
      });
  }

  editEmployee() {
    this.employeeService.editEmployee(this.employee)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = `Error occurred: (Status: ${error.status})`;
        }
      });
  }
}
