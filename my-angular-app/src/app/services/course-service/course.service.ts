// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { Course } from '../../types/coursetypes';

// @Injectable({
//   providedIn: 'root'
// })
// export class CourseService {

//   private dummyMaterials: string[] = ["Reading assignment 1", "Quiz 1", "Quiz 2", "Mid Term", "Homework 1"]
//   private dummyCourses: Course[] = [
//     {
//       department: "CS",
//       courseNumber: "371",
//       section: "01",
//       semester: "fall2024",
//       courseTitle: "Algorithms Analysis"
//     },
//     {
//       department: "CS",
//       courseNumber: "349",
//       section: "01",
//       semester: "fall2024",
//       courseTitle: "Software Engineering"
//     },
//     {
//       department: "HIST",
//       courseNumber: "150",
//       section: "01",
//       semester: "fall2024",
//       courseTitle: "Medicing and Healing"
//     }, {
//       department: "MATH",
//       courseNumber: "300",
//       section: "02",
//       semester: "fall2024",
//       courseTitle: "Introduction to proofs"
//     },
//   ]

//   private materialsSource = new BehaviorSubject<string[]>(this.dummyMaterials);
//   private coursesSource = new BehaviorSubject<Course[]>(this.dummyCourses);


//   public materials$ = this.materialsSource.asObservable();
//   public courses$ = this.coursesSource.asObservable();

//   constructor() { }

  // async addCourse() { //para: course_data
  //   // const response = await fetch('/api/courses/create/', {
  //   //   method: 'POST',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify(course_data),
  //   // });
  //   // return await response.json();
  // }

//   async getCourse(email: string) {
//     //TODO: fetch the user's courses using their email.


//   }

//   async getAllMaterial(courseId: string) {
//     //TODO: once the backend is setup, we will want to send a request to the backend and get the all the files

//     this.materialsSource.next(this.dummyMaterials);
//   }
  // async addMaterial(newMaterial: ) {
  //   //TODO: Once the backend is up, send a asynchronous call to the backend to create a new message.
  //   this.materialsSource.next([...this.materialsSource.getValue(), newMaterial]);
  // }

//   async deleteMaterial(index: number){
//     //TODO: implement deleting of material.
//     const newArray = this.materialsSource.getValue();

//     if (index >= 0 && index < newArray.length){
//       newArray.splice(index, 1);
//       this.materialsSource.next(newArray);
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course, Material } from '../../types/coursetypes';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})

export class CourseService {

  private materialsSource = new BehaviorSubject<Material[]>([]);
  private coursesSource = new BehaviorSubject<Course[]>([]);

  public materials$ = this.materialsSource.asObservable();
  public courses$ = this.coursesSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser.subscribe(user => {
      if (this.authService.isProfessor()) {
        this.getCourses(this.authService.getId()!);
      }
    });

   }

   fetchMaterials(semester: string, courseAndSection: string){
    this.http.get<{materials: Material[]}>(`http://127.0.0.1:8000/api/materials/get-materials-by-class-id/${courseAndSection}/`).subscribe({
      next: (materials) => {
        this.materialsSource.next(materials.materials)
      },
      error: (error) => console.error('Error fetching materials:', error),
    });
   }
  // async addCourse() {

  // try {
  //   const response = await this.http.post<any[]>(
  //     "http://127.0.0.1:8000/class_management/courses/create/",
  //     {
  //       name: "SOftware engineering",
  //       pin: "1234",
  //       section: "01",
  //       professor_id: "2"
  //     }  
  //   ).pipe(
  //     tap(res => console.log("Response:", res)),
  //     catchError(error => {
  //       console.error("Error:", error);
  //       return of([]);  // Return an empty array if there’s an error
  //     })
  //   ).toPromise();

  //   console.log("Course added successfully:", response);
  // } catch (error) {
  //   console.error("Failed to add course:", error);
  // }
  private apiUrl = 'http://127.0.0.1:8000/class-management';


  async addCourse(name: string, section: string, department: string, course_number: string){
    try {
      let professor_id = '0'
      this.authService.currentUser.subscribe((user) => {
        if (user){
          professor_id = user?.id
        }
        })
      this.http.post<any>("http://127.0.0.1:8000/class-management/courses/create/", {name, section, department, course_number, professor_id}).subscribe({
        next: (response) => console.log(response),
        error: (error) => console.error("error in adding a course", error)
      })
    } catch (error) {
      console.error('Error creating course:', error);
      return 
    }
  }

  async getCourses(id: string) {
    this.http.get<{courses: Course[]}>(`${this.apiUrl}/courses/professor/${id}/`).subscribe({
      next: (response: {courses: Course[]}) => {
        this.coursesSource.next(response.courses)}, 
      error: (error) => console.error('Error fetching courses:', error),
    });
  }

  // async getMaterials(course_id: number) {
  //   this.http.get<string[]>(`${this.apiUrl}/materials/all/${course_id}/`).subscribe({
  //     next: (materials) => this.materialsSource.next(materials),
  //     error: (error) => console.error('Error fetching materials:', error),
  //   });
  // }

  // async addMaterial(newMaterial: {title: string; category: string; course_id: number}) {
  //   try {
  //     const response = this.http.post(`${this.apiUrl}/materials/upload/`, newMaterial);
  //     // Refresh the materials list after adding a new material
  //     if (response) {
  //       this.getMaterials(newMaterial.course_id);
  //     }
  //   } catch (error) {
  //     console.error('Error adding material:', error);
  //   }
  // }

  // async addMaterial(newMaterial: string) {
  //   //TODO: Once the backend is up, send a asynchronous call to the backend to create a new message.

  //   this.materialsSource.next([...this.materialsSource.getValue(), newMaterial]);
  // }

  async deleteMaterial(material_id: number) {
    try {
      this.http.delete(`${this.apiUrl}/materials/delete/${material_id}/`);
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  }

  async uploadFile(file: File, fileType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append("materialType", fileType)
    
    // await this.http.post("http://127.0.0.1:8000/api/materials/add-material/", formData, {
    //   headers: new HttpHeaders({ 'X-CSRFToken': this.getCSRFToken() }),
    //   withCredentials: true
    // }).pipe(
    //   tap(res => console.log("Response:", res)),
    //   catchError(error => {
    //     console.error("Error:", error);
    //     return of([]);  // Return an empty array if there’s an error
    //   })
    // ).toPromise();
  }

  private getCSRFToken(): string {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1] || '';
  }


  // async updateMaterial(material_id: number, updatedMaterial: FormData, course_id: number) {
  //   try {
  //     const headers = new HttpHeaders().append('enctype', 'multipart/form-data');
  //     this.http.put(`${this.apiUrl}/materials/update/${material_id}/`, updatedMaterial, { headers });
  //     // Refresh the materials list after updating
  //     this.getMaterials(course_id);
  //   } catch (error) {
  //     console.error('Error updating material:', error);
  //   }
  // }
}
