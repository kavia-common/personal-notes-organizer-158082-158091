import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/note.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // PUBLIC_INTERFACE
  /**
   * Handles HTTP errors
   * @param error The HTTP error response
   * @returns Observable with error message
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    // Check if we're in browser environment before using ErrorEvent
    if (typeof window !== 'undefined' && error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error or other error
      errorMessage = error.status 
        ? `Server returned code ${error.status}: ${error.message || 'Unknown error'}`
        : 'Network error occurred';
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // PUBLIC_INTERFACE
  /**
   * Retrieves all notes from the backend
   * @returns Observable<Note[]> Array of all notes
   */
  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`).pipe(
      catchError(this.handleError)
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Retrieves a specific note by ID
   * @param id The ID of the note to retrieve
   * @returns Observable<Note> The requested note
   */
  getNoteById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/notes/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Creates a new note
   * @param note The note data to create
   * @returns Observable<Note> The created note with ID
   */
  createNote(note: CreateNoteRequest): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/notes`, note).pipe(
      catchError(this.handleError)
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Updates an existing note
   * @param id The ID of the note to update
   * @param note The updated note data
   * @returns Observable<Note> The updated note
   */
  updateNote(id: number, note: UpdateNoteRequest): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/notes/${id}`, note).pipe(
      catchError(this.handleError)
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Deletes a note by ID
   * @param id The ID of the note to delete
   * @returns Observable<void>
   */
  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notes/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Searches notes by title and content
   * @param query The search query string
   * @returns Observable<Note[]> Array of matching notes
   */
  searchNotes(query: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/notes/search?q=${encodeURIComponent(query)}`).pipe(
      catchError(this.handleError)
    );
  }
}
