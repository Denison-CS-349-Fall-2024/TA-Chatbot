import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../../types/coursetypes';

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

  constructor() { }

  async addCourse() {
    //TODO: add a new course in the backend.

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
}
