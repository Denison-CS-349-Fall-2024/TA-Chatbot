import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course, Material } from '../../types/coursetypes';
import { AuthService } from '../auth-service/auth.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})

export class CourseService {

  private materialsSource = new BehaviorSubject<Material[]>([]);
  private archivedCoursesSource = new BehaviorSubject<Course[]>([]);
  private coursesSource = new BehaviorSubject<Course[]>([]);

  public materials$ = this.materialsSource.asObservable();
  public courses$ = this.coursesSource.asObservable();
  public archivedCourses$ = this.archivedCoursesSource.asObservable();

  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser.subscribe(user => {
      if (this.authService.isProfessor()) {
        this.getInstructorCourses(this.authService.getId()!);
      }else{
        //TODO: Fetch courses for the students.
      }
    });
   }   

  async addCourse(name: string, section: string, department: string, course_number: string, credits: string) {
    try {
      let professor_id = this.authService.getId()!;
      
      return new Promise((resolve, reject) => {
        this.http.post<{message: string, course: Course, error?: string}>(
          `${this.apiUrl}/class-management/courses/create/`,
          {name, section, department, course_number, professor_id, credits}
        ).subscribe({
          next: (response) => {
            if (response.course) {
              this.coursesSource.next([...this.coursesSource.getValue(), response.course]);
              resolve(response);
            }
          },
          error: (error) => {
            console.error("Error in adding a course", error);
            if (error.status === 409) {
              reject(new Error('A course with these details already exists for this semester'));
            } else {
              reject(new Error('Failed to create course'));
            }
          }
        });
      });
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async getInstructorCourses(id: string) {
    this.http.get<{courses: Course[]}>(`${this.apiUrl}/class-management/courses/professor/${id}/`).subscribe({
      next: (response: {courses: Course[]}) => {
        this.archivedCoursesSource.next(response.courses.filter(course => !course.isActive))
        this.coursesSource.next(response.courses.filter(course => course.isActive))
      }, 
      error: (error) => console.error('Error fetching courses:', error),
    });
  }

  async getStudentCourses(id: string) {
    //TODO: Fetch courses for the students.
  }

  async deleteMaterial(material_id: string) {
    try {

      this.http.delete(`${this.apiUrl}/materials/delete/${material_id}/`).subscribe({
        next: (response) => {
          this.materialsSource.next(this.materialsSource.getValue().filter(material => material.id !== material_id));
        },
        error: (error) => console.error('Error deleting material:', error),
      });
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  }


  async fetchMaterials(semester: string, courseAndSection: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<{materials: Material[]}>(`${environment.apiEndpoint}/materials/get-materials-by-class-id/${semester}/${courseAndSection}/`).subscribe({
        next: (materials) => {
          this.materialsSource.next(materials.materials)
          resolve();
        },
        error: (error) => {
          console.error('Error fetching materials:', error);
          reject(error);
        }
      });
    });
   }

  uploadFile(file: File, fileType: string, materialName: string, semester: string, course_id: string): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);
    formData.append('materialName', materialName);
    formData.append('materialType', fileType);
    formData.append('semester', semester);
    formData.append('class_id', course_id);
    formData.append('enableAI', 'false');
  
    return this.http.post(`${this.apiUrl}/materials/upload/`, formData).pipe(
      tap(() => {
        this.fetchMaterials(semester, course_id);
      }),
      catchError((error) => {
        console.error('Error uploading file:', error);
        throw error; // Propagate the error
      })
    );
  }
  
  async archiveCourse(courseId: string): Promise<void> {
    this.http.put(`${this.apiUrl}/class-management/courses/update/`, {id: courseId, isActive: false}).subscribe({
      next: (response) => {
        this.coursesSource.next(this.coursesSource.getValue().filter(course => course.id !== courseId));
      },
      error: (error) => console.error('Error archiving course:', error),
    });
  }

  async unarchiveCourse(courseId: string): Promise<void> {
    this.http.put(`${this.apiUrl}/class-management/courses/update/`, {id: courseId, isActive: true}).subscribe({
      next: (response) => {
        this.coursesSource.next(this.coursesSource.getValue().filter(course => course.id !== courseId));
      },
      error: (error) => console.error('Error unarchiving course:', error),
    });
  }

  async fetchCourses() {
    // Fetch both active and archived courses
    // Update the courses$ observable accordingly
  }
}
