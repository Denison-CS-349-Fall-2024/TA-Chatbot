import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Course } from '../../types/coursetypes';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private dummyMaterials: string[] = ["Reading assignment 1", "Quiz 1", "Quiz 2", "Mid Term", "Homework 1"]
  private dummyCourses: Course[] = [
    {
      department: "CS",
      courseNumber: "371",
      section: "01",
      semester: "fall2024",
      courseTitle: "Algorithms Analysis"
    },
    {
      department: "CS",
      courseNumber: "349",
      section: "01",
      semester: "fall2024",
      courseTitle: "Software Engineering"
    },
    {
      department: "HIST",
      courseNumber: "150",
      section: "01",
      semester: "fall2024",
      courseTitle: "Medicing and Healing"
    }, {
      department: "MATH",
      courseNumber: "300",
      section: "02",
      semester: "fall2024",
      courseTitle: "Introduction to proofs"
    },
  ]

  private materialsSource = new BehaviorSubject<string[]>(this.dummyMaterials);
  private coursesSource = new BehaviorSubject<Course[]>(this.dummyCourses);


  public materials$ = this.materialsSource.asObservable();
  public courses$ = this.coursesSource.asObservable();

  constructor(private http: HttpClient) { }

  async addCourse() {
    //TODO: add a new course in the backend.
      // console.log("the function is called");
      // this.http.post<any[]>("http://127.0.0.1:8000/class_management/courses/create/", {
        
      // }).pipe(
      //   tap(res => console.log(res)),
      //   catchError(error => {console.error(error)
      //     return of([])
      //   })
      // ).subscribe()

      console.log("The function is called");

  try {
    const response = await this.http.post<any[]>(
      "http://127.0.0.1:8000/class_management/courses/create/",
      {
        name: "SOftware engineering",
        pin: "1234",
        section: "01",
        professor_id: "2"
      }  
    ).pipe(
      tap(res => console.log("Response:", res)),
      catchError(error => {
        console.error("Error:", error);
        return of([]);  // Return an empty array if there’s an error
      })
    ).toPromise();

    console.log("Course added successfully:", response);
  } catch (error) {
    console.error("Failed to add course:", error);
  }
  }

  async getCourse(email: string) {
    //TODO: fetch the user's courses using their email.


  }

  async getAllMaterial(courseId: string) {
    //TODO: once the backend is setup, we will want to send a request to the backend and get the all the files

    this.materialsSource.next(this.dummyMaterials);
  }
  async addMaterial(newMaterial: string) {
    //TODO: Once the backend is up, send a asynchronous call to the backend to create a new message.

    this.materialsSource.next([...this.materialsSource.getValue(), newMaterial]);
  }

  async deleteMaterial(index: number){
    //TODO: implement deleting of material.
    const newArray = this.materialsSource.getValue();

    if (index >= 0 && index < newArray.length){
      newArray.splice(index, 1);
      this.materialsSource.next(newArray);
    }
  }

  async uploadFile(file: File, fileType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append("materialType", fileType)
    
    await this.http.post("http://127.0.0.1:8000/api/materials/add-material/", formData, {
      headers: new HttpHeaders({ 'X-CSRFToken': this.getCSRFToken() }),
      withCredentials: true
    }).pipe(
      tap(res => console.log("Response:", res)),
      catchError(error => {
        console.error("Error:", error);
        return of([]);  // Return an empty array if there’s an error
      })
    ).toPromise();
  }

  private getCSRFToken(): string {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1] || '';
  }

}
