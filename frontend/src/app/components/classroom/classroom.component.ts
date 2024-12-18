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

/**
 * Interface defining the properties of a student in the course.
 */
interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  lastActive: Date | null;
}

/**
 * Type defining the available tabs in the classroom component.
 */
type TabType = 'materials' | 'students' | 'settings';

/**
 * Interface for managing course settings in the classroom component.
 */
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
  selector: 'app-classroom', // Selector for the classroom component.
  standalone: true, // Indicates that this component can be used without being part of a module.
  imports: [
    CommonModule,
    TaMaterialsComponent,
    RouterModule,
    FormsModule,
    AddMaterialModalComponent,
    NgxDocViewerModule,
    SafePipe,
    ConfirmationModalComponent,
    ToastComponent
  ], // Modules and components used within the classroom component.
  templateUrl: './classroom.component.html', // HTML template for the component.
  styleUrl: './classroom.component.css' // CSS file for the component's styles.
})
export class ClassroomComponent implements OnInit {
  // Tabs available for navigation in the classroom.
  protected tabs: TabType[] = ['materials', 'students', 'settings'];

  // List of all students in the classroom.
  protected students: Student[] = [];
  // List of students after applying filters and sorting.
  protected filteredStudents: Student[] = [];
  // Search term for filtering students.
  protected studentSearchTerm = '';
  // Key used for sorting students.
  protected studentSortKey: keyof Student = 'name';
  // Direction for sorting ('asc' or 'desc').
  protected studentSortDirection: 'asc' | 'desc' = 'asc';

  // Information about the course and semester.
  protected semester!: string;
  protected courseAndSection!: string;

  // Flags for view and loading states.
  protected isStudentView = false; // Toggles between student and instructor views.
  protected isLoading = true; // Indicates if data is being loaded.
  protected selectedTab: TabType = 'materials'; // Currently selected tab.

  // State for showing or hiding the settings menu.
  protected showSettingsMenu = false;

  // Course materials and settings.
  protected courseMaterials: Material[] = []; // List of course materials.
  protected courseSettings!: Course; // Current course settings.

  // Modal-related states.
  protected isAddMaterialModalOpen = false; // State of the add-material modal.
  protected selectedMaterial: Material | null = null; // Currently selected material.

  // Subscription for tracking changes in course materials.
  protected materialSubscription!: Subscription;

  // Material selected for deletion.
  protected materialToDelete: Material | null = null;

  // Course details and metadata.
  protected courseDetails: Course | null = null;
  protected lastUpdated: string | null = null;

  // Original course settings for change detection.
  protected originalSettings: Course | null = null;
  protected hasUnsavedChanges = false; // Indicates if there are unsaved changes.

  // AI personality and language options for course settings.
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
    private route: ActivatedRoute, // ActivatedRoute to access route parameters.
    private courseService: CourseService, // Service to manage course-related operations.
    protected toastService: ToastService // Service to display toast notifications.
  ) {}

  /**
   * Lifecycle hook that initializes the component.
   * Fetches course details, students, and materials.
   */
  async ngOnInit() {
    this.semester = this.route.snapshot.paramMap.get('semester')!; // Retrieve semester from route.
    this.courseAndSection = this.route.snapshot.paramMap.get('courseAndSection')!; // Retrieve course and section from route.

    // Parse course and section details from route parameters.
    const matches = this.courseAndSection.match(/([a-z]+)(\d+)-(\d+)/i);
    if (matches) {
      const [_, department, courseNumber, section] = matches;

      // Fetch course details from the course service.
      this.courseService.getCourseDetails(
        this.semester,
        department,
        courseNumber,
        section
      ).subscribe({
        next: (response) => {
          this.courseDetails = {
            ...response.course,
            section: response.course.section || '',
            pin: response.course.pin || ''
          };
          this.lastUpdated = response.course.lastUpdated; // Update last updated timestamp.

          // Initialize course settings with fetched data.
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

          // Save original settings for comparison.
          this.originalSettings = { ...this.courseSettings };

          // Map and update student data with last active timestamp.
          this.students = response.students.map((student) => ({
            ...student,
            lastActive: student.lastActive ? new Date(student.lastActive) : null
          }));
          this.filterStudents(); // Apply filters to student list.
        },
        error: () => {
          this.toastService.show('error', 'Error', 'Failed to load course details'); // Show error toast.
        }
      });
    }

    // Subscribe to materials observable for updates.
    this.materialSubscription = this.courseService.materials$.subscribe((materials) => {
      this.courseMaterials = materials; // Update course materials.
      this.isLoading = false; // Set loading to false.
    });

    // Fetch initial materials for the course.
    await this.courseService.fetchMaterials(this.semester, this.courseAndSection);
  }

  /**
   * Sets the currently selected tab.
   * @param tab - The tab to be selected.
   */
  setSelectedTab(tab: TabType) {
    this.selectedTab = tab; // Update selected tab.
  }

  /**
   * Filters the student list based on the search term and applies sorting.
   */
  filterStudents() {
    this.filteredStudents = this.students
      .filter((student) => 
        student.name.toLowerCase().includes(this.studentSearchTerm.toLowerCase()) || 
        student.email.toLowerCase().includes(this.studentSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[this.studentSortKey];
        const bValue = b[this.studentSortKey];

        // Handle null values in sorting.
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        // Special handling for dates.
        if (this.studentSortKey === 'lastActive') {
          const aDate = aValue as Date;
          const bDate = bValue as Date;
          return this.studentSortDirection === 'asc'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        // Regular string/number comparison.
        return this.studentSortDirection === 'asc'
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
  }

  /**
   * Toggles the view mode between instructor and student views.
   */
  toggleView() {
    this.isStudentView = !this.isStudentView; // Switch view mode.
    this.toastService.show(
      'info',
      'View Changed',
      `Switched to ${this.isStudentView ? 'student' : 'instructor'} view`
    ); // Show toast notification.
  }



  exportCourseData() {
    try {
      // Placeholder for course data export implementation.
      this.toastService.show('success', 'Success', 'Course data exported successfully'); // Display success notification.
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to export course data'); // Display error notification if export fails.
    }
  }
  
  generateReport() {
    try {
      // Placeholder for report generation logic.
      this.toastService.show('success', 'Processing', 'Generating course report...'); // Notify the user that report generation has started.
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to generate report'); // Display error notification if report generation fails.
    }
  }
  
  sendBulkMessage() {
    try {
      // Placeholder for bulk messaging implementation.
      this.toastService.show('success', 'Success', 'Messages sent successfully'); // Notify the user of successful message sending.
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to send messages'); // Display error notification if messaging fails.
    }
  }
  
  sortStudents(key: string) {
    const sortKey = key as keyof Student;
  
    // Toggle sorting direction if the same key is selected, otherwise set to ascending.
    if (this.studentSortKey === sortKey) {
      this.studentSortDirection = this.studentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.studentSortKey = sortKey;
      this.studentSortDirection = 'asc';
    }
  
    this.filterStudents(); // Apply sorting after updating the direction or key.
  }
  
  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu; // Toggle visibility of the settings menu.
  }
  
  closeSettingsMenu() {
    this.showSettingsMenu = false; // Hide the settings menu.
  }
  
  checkForChanges() {
    // Compare current course settings with original settings to detect changes.
    this.hasUnsavedChanges = this.originalSettings
      ? Object.keys(this.courseSettings).some(
          (key) => this.courseSettings[key as keyof Course] !== this.originalSettings?.[key as keyof Course]
        )
      : false;
  }
  
  async saveSettings() {
    try {
      const courseId = this.courseDetails?.id;
      if (!courseId) {
        throw new Error('Course ID not found'); // Throw error if course ID is missing.
      }
  
      // Prepare update data with the relevant fields for saving.
      const updateData = {
        id: courseId,
        courseTitle: this.courseSettings.courseTitle,
        section: this.courseSettings.section,
        department: this.courseSettings.department,
        courseNumber: this.courseSettings.courseNumber,
        credits: this.courseSettings.credits,
        isActive: true,
      };
  
      await this.courseService.updateCourseSettings(updateData); // Update course settings via the service.
      this.originalSettings = { ...this.courseSettings }; // Sync original settings with saved settings.
      this.hasUnsavedChanges = false; // Reset unsaved changes flag.
      this.toastService.show('success', 'Success', 'Course settings saved successfully'); // Notify the user of successful save.
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to save settings'); // Display error notification if save fails.
    }
  }
  
  resetSettings() {
    if (this.originalSettings) {
      this.courseSettings = { ...this.originalSettings }; // Revert to original settings.
      this.hasUnsavedChanges = false; // Reset unsaved changes flag.
    }
  }
  
  getMaterialTypeClass(type: Material['type']): string {
    // Map material types to their respective classes for styling.
    const classes = {
      pdf: 'bg-red-100 text-red-600',
      docx: 'bg-yellow-100 text-yellow-600',
    };
    return classes[type]; // Return the class corresponding to the material type.
  }
  
  getMaterialIcon(type: Material['type']): string {
    // Return the appropriate SVG path markup for the given material type.
    const icons = {
      pdf: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>`,
      docx: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>`,
    };
    return icons[type]; // Return the SVG markup based on type.
  }
  
  openAddMaterialModal() {
    this.isAddMaterialModalOpen = true; // Open the add material modal.
  }
  
  handleModalClosed() {
    this.isAddMaterialModalOpen = false; // Close the add material modal.
  }
  
  bulkUpload() {
    // Placeholder for bulk upload implementation.
    this.toastService.show('info', 'Coming Soon', 'Bulk upload feature coming soon'); // Notify the user that the feature is not yet available.
  }
  
  async deleteMaterial(material: Material) {
    this.materialToDelete = material; // Store the material to be deleted.
  }
  
  protected async handleDeleteConfirm() {
    if (this.materialToDelete) {
      try {
        // Delete the selected material using the course service.
        await this.courseService.deleteMaterial(this.materialToDelete.id);
        this.toastService.show('success', 'Success', `${this.materialToDelete.title} deleted successfully`); // Notify of successful deletion.
      } catch (error) {
        this.toastService.show('error', 'Error', `Failed to delete ${this.materialToDelete.title}`); // Notify if deletion fails.
      } finally {
        this.materialToDelete = null; // Reset the material to delete.
      }
    }
  }
  
  protected handleDeleteCancel() {
    this.materialToDelete = null; // Cancel the delete operation.
  }
  
  protected viewMaterial(material: Material) {
    this.selectedMaterial = material; // Set the material to be viewed.
  }
  
  closeViewer() {
    this.selectedMaterial = null; // Close the material viewer.
  }
  
  protected downloadMaterial(material: Material) {
    try {
      // Placeholder for download logic.
      this.toastService.show('success', 'Success', `${material.title} download started`); // Notify of successful download initiation.
    } catch (error) {
      this.toastService.show('error', 'Error', `Failed to download ${material.title}`); // Notify if download fails.
    }
  }
  
  protected editMaterial(material: Material) {
    try {
      // Placeholder for edit material logic.
      this.toastService.show('info', 'Coming Soon', 'Edit feature coming soon'); // Notify the user of upcoming edit functionality.
    } catch (error) {
      this.toastService.show('error', 'Error', 'Failed to edit material'); // Notify if edit fails.
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
      },
    ];
  
    // Simulate data loading with a delay.
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.courseMaterials = dummyMaterials; // Load dummy materials.
        resolve();
      }, 800);
    });
  }
  
  // Formats file size into a readable string (e.g., KB, MB).
  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  formatSemester(semester: string): string {
    return formatSemester(semester); // Format the semester string.
  }
  
  protected downloadStudentList() {
    // Prepare data for CSV export.
    const csvData = this.filteredStudents.map((student) => ({
      Name: student.name,
      Email: student.email,
      Status: student.status,
      'Last Active': student.lastActive
        ? new Date(student.lastActive).toLocaleString()
        : 'Never',
    }));
  
    // Convert data to CSV format.
    const headers = Object.keys(csvData[0]);
    const csv = [
      headers.join(','), // Add header row.
      ...csvData.map((row) =>
        headers
          .map((header) =>
            `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`
          )
          .join(',')
      ),
    ].join('\n');
  
    // Create a downloadable blob and trigger download.
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.courseAndSection}_students_${this.semester}.csv`;
  
    document.body.appendChild(link); // Append link to body.
    link.click(); // Trigger click for download.
    document.body.removeChild(link); // Clean up link element.
    window.URL.revokeObjectURL(url); // Revoke the object URL.
  
    this.toastService.show('success', 'Success', 'Student list downloaded successfully'); // Notify of successful download.
  }
  
  copyPin() {
    if (this.courseDetails?.pin) {
      navigator.clipboard.writeText(this.courseDetails.pin); // Copy course PIN to clipboard.
      this.toastService.show('success', 'Copied!', 'Course PIN copied to clipboard'); // Notify of successful copy.
    }
  }
}  