/**
 * Interface representing a user.
 */
export interface User {
    id: string;
    email: string;
    isProf: boolean;
    firstName: string;
    lastName: string;
}

/**
 * Interface representing a student.
 */
export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    lastActive: string;
}