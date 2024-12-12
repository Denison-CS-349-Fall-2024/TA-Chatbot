import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaMaterialsComponent } from "../../components/ta-materials/ta-materials.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course-service/course.service';
import { ToastService } from '../../services/toast-service/toast.service';
import { FormsModule } from '@angular/forms';
import { AddMaterialModalComponent } from '../../components/add-material-modal/add-material-modal.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { SafePipe } from '../../pipes/safe.pipe';
import { Course, Material } from '../../types/coursetypes';
import { Subscription } from 'rxjs';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { formatSemester } from '../../utils/format';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  lastActive: Date | null;
}

type TabType = 'materials' | 'students' | 'settings';

interface CourseSettings {
  name: string;
  section: string;
  department: string;
  courseNumber: string;
  credits: string;
  isVisible: boolean;
  allowStudentDiscussions: boolean;
  aiResponseTime: number;
  maxQuestionsPerStudent: number;
  requireApproval: boolean;
  notifyTAOnQuestions: boolean;
  aiPersonality: 'professional' | 'friendly' | 'socratic';
  defaultLanguage: 'en' | 'es' | 'fr';
}

@Component({
  selector: 'app-classroom',
  standalone: true,
  imports: [CommonModule, TaMaterialsComponent, RouterModule, FormsModule, AddMaterialModalComponent, NgxDocViewerModule, SafePipe, ConfirmationModalComponent, ToastComponent],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css'
})
export class ClassroomComponent  implements OnInit  {
  protected tabs: TabType[] = [
    'materials', 
    'students', 
    'settings'
  ];
  
  protected students: Student[] = [];
  protected filteredStudents: Student[] = [];
  protected studentSearchTerm = '';
  protected studentSortKey: keyof Student = 'name';
  protected studentSortDirection: 'asc' | 'desc' = 'asc';
  
  protected semester!: string;
  protected courseAndSection!: string;
  protected isStudentView = false;
  protected isLoading = true;
  protected selectedTab: TabType = 'materials';

  protected showSettingsMenu = false;
  protected courseMaterials: Material[] = [];
  protected courseSettings!: Course;
  // protected courseSettings: CourseSettings = {
  //   name: '',
  //   section: '',
  //   department: '',
  //   courseNumber: '',
  //   credits: '',
  //   isVisible: true,
  //   allowStudentDiscussions: true,
  //   aiResponseTime: 30,
  //   maxQuestionsPerStudent: 50,
  //   requireApproval: false,
  //   notifyTAOnQuestions: true,
  //   aiPersonality: 'professional',
  //   defaultLanguage: 'en'
  // };

  protected isAddMaterialModalOpen = false;
  protected selectedMaterial: Material | null = null;

  protected materialSubscription!: Subscription;

  protected materialToDelete: Material | null = null;

  protected courseDetails: Course | null = null;
  protected lastUpdated: string | null = null;

  protected originalSettings: Course | null = null;
  protected hasUnsavedChanges = false;

  protected aiPersonalityOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'socratic', label: 'Socratic Method' }
  ];

  protected languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' }
  ];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    protected toastService: ToastService,
  ) {}

  async ngOnInit() {
    this.semester = this.route.snapshot.paramMap.get("semester")!;
    this.courseAndSection = this.route.snapshot.paramMap.get("courseAndSection")!;
    
    const matches = this.courseAndSection.match(/([a-z]+)(\d+)-(\d+)/i);
    if (matches) {
      const [_, department, courseNumber, section] = matches;
      
      this.courseService.getCourseDetails(
        this.semester,
        department,
        parseInt(courseNumber),
        section
      ).subscribe({
        next: (response) => {
          this.courseDetails = response.course;
          this.lastUpdated = response.course.lastUpdated;
          
          this.courseSettings = {
            id: response.course.id,
            semester: response.course.semester,
            professorFirstName: response.course.professorFirstName,
            professorLastName: response.course.professorLastName,
            pin: response.course.pin,
            isActive: response.course.isActive,
            courseTitle: response.course.courseTitle,
            section: response.course.section,
            department: response.course.department,
            courseNumber: response.course.courseNumber,
            credits: response.course.credits
          };
          
          this.originalSettings = { ...this.courseSettings };
          
          this.students = response.students.map(student => ({
            ...student,
            lastActive: student.lastActive ? new Date(student.lastActive) : null
          }));
          this.filterStudents();
        },
        error: (error) => {
          this.toastService.show('error', 'Error', 'Failed to load course details');
        }
      });
    }

    this.materialSubscription = this.courseService.materials$.subscribe((materials) => {
      this.courseMaterials = materials;
      this.isLoading = false;
    });

    await this.courseService.fetchMaterials(this.semester, this.courseAndSection);
  }

  setSelectedTab(tab: TabType) {
    this.selectedTab = tab;
  }

  async loadCourseData() {
    try {
      this.isLoading = true;
      await Promise.all([
        this.loadStudents(),
        this.loadDummyMaterials(),
        this.courseService.fetchMaterials(this.semester, this.courseAndSection)
      ]);
      
      this.toastService.show('success', 'Success', 'Course data loaded successfully');
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to load course data');
    } finally {
      this.isLoading = false;
    }
  }

  async loadStudents() {
    // Simulated student data
    this.students = Array(45).fill(null).map((_, i) => ({
      id: `STU${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@university.edu`,
      status: Math.random() > 0.6 ? 'Enrolled' : (Math.random() > 0.3 ? 'Waitlisted' : 'Not Enrolled'),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
    this.filterStudents();
  }

  filterStudents() {
    this.filteredStudents = this.students
      .filter(student => 
        student.name.toLowerCase().includes(this.studentSearchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.studentSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[this.studentSortKey];
        const bValue = b[this.studentSortKey];

        // Handle null values in sorting
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;  // null values go to the end
        if (bValue === null) return -1;

        // Special handling for dates
        if (this.studentSortKey === 'lastActive') {
          const aDate = aValue as Date;
          const bDate = bValue as Date;
          return this.studentSortDirection === 'asc' 
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        // Regular string/number comparison
        return this.studentSortDirection === 'asc' 
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
  }

  toggleView() {
    this.isStudentView = !this.isStudentView;
    this.toastService.show(
      'info',
      'View Changed',
      `Switched to ${this.isStudentView ? 'student' : 'instructor'} view`
    );
  }


  exportCourseData() {
    try {
      // Implementation would go here
      this.toastService.show('success', 'Success', 'Course data exported successfully');
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to export course data');
    }
  }

  generateReport() {
    try {
      // Implementation would go here
      this.toastService.show('success', 'Processing', 'Generating course report...');
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to generate report');
    }
  }

  sendBulkMessage() {
    try {
      // Implementation would go here
      this.toastService.show('success', 'Success', 'Messages sent successfully');
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to send messages');
    }
  }

  sortStudents(key: string) {
    const sortKey = key as keyof Student;
    
    if (this.studentSortKey === sortKey) {
      this.studentSortDirection = this.studentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.studentSortKey = sortKey;
      this.studentSortDirection = 'asc';
    }

    this.filterStudents();
  }

  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  closeSettingsMenu() {
    this.showSettingsMenu = false;
  }

  checkForChanges() {
    this.hasUnsavedChanges = this.originalSettings ? Object.keys(this.courseSettings).some(
      key => this.courseSettings[key as keyof Course] !== this.originalSettings?.[key as keyof Course]
    ) : false;
  }

  async saveSettings() {
    try {
      const courseId = this.courseDetails?.id;
      if (!courseId) {
        throw new Error('Course ID not found');
      }

      const updateData = {
        id: courseId,
        courseTitle: this.courseSettings.courseTitle,
        section: this.courseSettings.section,
        department: this.courseSettings.department,
        courseNumber: this.courseSettings.courseNumber,
        credits: this.courseSettings.credits,
        isActive: true,
        // Add any other fields you want to update
      };

      await this.courseService.updateCourseSettings(updateData);
      this.originalSettings = { ...this.courseSettings };
      this.hasUnsavedChanges = false;
      this.toastService.show('success', 'Success', 'Course settings saved successfully');
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to save settings');
    }
  }

  resetSettings() {
    if (this.originalSettings) {
      this.courseSettings = { ...this.originalSettings };
      this.hasUnsavedChanges = false;
    }
  }

  getMaterialTypeClass(type: Material['type']): string {
    const classes = {
      pdf: 'bg-red-100 text-red-600',
      docx: 'bg-yellow-100 text-yellow-600'
    };
    return classes[type];
  }

  getMaterialIcon(type: Material['type']): string {
    // Return SVG markup based on type
    const icons = {
      pdf: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>`,
      docx: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>`
    };
    return icons[type];
  }

  openAddMaterialModal() {
    this.isAddMaterialModalOpen = true;
  }

  handleModalClosed() {
    this.isAddMaterialModalOpen = false;
  }

  bulkUpload() {
    // Implementation for bulk upload
    this.toastService.show('info', 'Coming Soon', 'Bulk upload feature coming soon');
  }

  async deleteMaterial(material: Material) {
    this.materialToDelete = material;
  }

  protected async handleDeleteConfirm() {
    if (this.materialToDelete) {
      try {
        await this.courseService.deleteMaterial(this.materialToDelete.id);
        this.toastService.show('success', 'Success', `${this.materialToDelete.title} deleted successfully`);
      } catch (error) {
        this.toastService.show('error', 'Error', `Failed to delete ${this.materialToDelete.title}`);
      } finally {
        this.materialToDelete = null;
      }
    }
  }

  protected handleDeleteCancel() {
    this.materialToDelete = null;
  }

  protected viewMaterial(material: Material) {
    this.selectedMaterial = material;
  }

  closeViewer() {
    this.selectedMaterial = null;
  }

  protected downloadMaterial(material: Material) {
    try {
      // Implement download logic
      this.toastService.show('success', 'Success', `${material.title} download started`);
    } catch (error) {
      this.toastService.show('error', 'Error', `Failed to download ${material.title}`);
    }
  }

  protected editMaterial(material: Material) {
    try {
      // Implement edit logic
      this.toastService.show('info', 'Coming Soon', 'Edit feature coming soon');
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to edit material');
    }
  }

  private loadDummyMaterials() {
    const dummyMaterials: Material[] = [
      {
        id: '1',
        title: 'Course Syllabus',
        type: 'pdf',
        size: 2500000,
        uploadDate: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Lecture Notes - Week 1',
        type: 'docx',
        size: 1800000,
        uploadDate: new Date('2024-01-28'),
      }
    ];
  

    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.courseMaterials = dummyMaterials;
        resolve();
      }, 800);
    });
  }
  
  // Add this pipe method for file size formatting
  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatSemester(semester: string): string {
    return formatSemester(semester);
  }

  protected downloadStudentList() {
    // Only include filtered students in the CSV
    const csvData = this.filteredStudents.map(student => ({
      Name: student.name,
      Email: student.email,
      Status: student.status,
      'Last Active': student.lastActive ? new Date(student.lastActive).toLocaleString() : 'Never'
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(','), // Header row
      ...csvData.map(row => headers.map(header => 
        // Wrap values in quotes and escape existing quotes
        `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');

    // Create and download blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.courseAndSection}_students_${this.semester}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    this.toastService.show('success', 'Success', 'Student list downloaded successfully');
  }

  copyPin() {
    if (this.courseDetails?.pin) {
      navigator.clipboard.writeText(this.courseDetails.pin);
      this.toastService.show('success', 'Copied!','Course PIN copied to clipboard');
    }
  }
}
