export interface Course  {
  id: string,
  courseTitle: string
  department: string,
  courseNumber: string,
  section: string,
  semester: string,
  isActive: boolean,
  credits: string
}

export interface Material {
  id: string,
  title: string,
  type: 'pdf' | 'docx'
  size: number
  uploadDate: Date,
  
}