import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { AuthService } from '../auth-service/auth.service';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(CourseService);
  });

  /**
   * Test to check if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test to check if getInstructorCourses method is defined.
   */
  it('should have getInstructorCourses method', () => {
    expect(service.getInstructorCourses).toBeDefined();
  });

  /**
   * Test to check if getStudentCourses method is defined.
   */
  it('should have getStudentCourses method', () => {
    expect(service.getStudentCourses).toBeDefined();
  });
});