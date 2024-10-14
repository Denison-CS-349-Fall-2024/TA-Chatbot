import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private dummyMaterials: string[] = ["Reading assignment 1", "Quiz 1", "Quiz 2", "Mid Term", "Homework 1"]


  private materialsSource = new BehaviorSubject<string[]>(this.dummyMaterials);

  public materials$ = this.materialsSource.asObservable();
  constructor() { }

  async getAllMaterial(courseId: string) {
    //TODO: once the backend is setup, we will want to send a request to the backend and get the all the files

    this.materialsSource.next(this.dummyMaterials);
  }
  async addMaterial(newMaterial: string) {
    //TODO: Once the backend is up, send a asynchronous call to the backend to create a new message.
    this.materialsSource.next([...this.materialsSource.getValue(), newMaterial]);
  }
}
