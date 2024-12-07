export interface Course  {
  id: string,
  courseTitle: string,
  department: string,
  courseNumber: string,
  section: string,
  semester: string,
  credits: string,
  professorFirstName: string,
  professorLastName: string,
  pin: string,
  isActive: boolean
}

export interface Material {
  id: string,
  title: string,
  type: 'pdf' | 'docx'
  size: number
  uploadDate: Date,
  
}