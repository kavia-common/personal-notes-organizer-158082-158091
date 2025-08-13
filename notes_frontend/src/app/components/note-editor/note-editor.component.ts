import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../models/note.model';
import { showConfirm } from '../../utils/browser.utils';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.css'
})
export class NoteEditorComponent implements OnChanges {
  @Input() selectedNote: Note | null = null;
  @Input() isCreatingNew: boolean = false;
  @Output() noteSaved = new EventEmitter<Note>();
  @Output() noteDeleted = new EventEmitter<number>();
  @Output() editorClosed = new EventEmitter<void>();

  title: string = '';
  content: string = '';
  isSaving: boolean = false;
  isDeleting: boolean = false;
  error: string | null = null;
  hasUnsavedChanges: boolean = false;

  constructor(private readonly notesService: NotesService) {
    // Service is used in multiple methods throughout the component
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedNote'] || changes['isCreatingNew']) {
      this.loadNoteData();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Loads note data into the editor
   */
  loadNoteData(): void {
    if (this.isCreatingNew) {
      this.title = '';
      this.content = '';
      this.hasUnsavedChanges = false;
    } else if (this.selectedNote) {
      this.title = this.selectedNote.title;
      this.content = this.selectedNote.content;
      this.hasUnsavedChanges = false;
    }
    this.error = null;
  }

  // PUBLIC_INTERFACE
  /**
   * Handles input changes and tracks unsaved changes
   */
  onInputChange(): void {
    this.hasUnsavedChanges = true;
    this.error = null;
  }

  // PUBLIC_INTERFACE
  /**
   * Saves the current note (create or update)
   */
  saveNote(): void {
    if (!this.title.trim() && !this.content.trim()) {
      this.error = 'Please enter a title or content';
      return;
    }

    this.isSaving = true;
    this.error = null;

    const noteData = {
      title: this.title.trim() || 'Untitled',
      content: this.content.trim()
    };

    if (this.isCreatingNew) {
      this.createNewNote(noteData);
    } else if (this.selectedNote?.id) {
      this.updateExistingNote(this.selectedNote.id, noteData);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Creates a new note
   * @param noteData The note data to create
   */
  private createNewNote(noteData: CreateNoteRequest): void {
    this.notesService.createNote(noteData).subscribe({
      next: (note) => {
        this.isSaving = false;
        this.hasUnsavedChanges = false;
        this.noteSaved.emit(note);
      },
      error: (error) => {
        this.isSaving = false;
        this.error = 'Failed to create note';
        console.error('Error creating note:', error);
      }
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Updates an existing note
   * @param id The note ID to update
   * @param noteData The updated note data
   */
  private updateExistingNote(id: number, noteData: UpdateNoteRequest): void {
    this.notesService.updateNote(id, noteData).subscribe({
      next: (note) => {
        this.isSaving = false;
        this.hasUnsavedChanges = false;
        this.noteSaved.emit(note);
      },
      error: (error) => {
        this.isSaving = false;
        this.error = 'Failed to update note';
        console.error('Error updating note:', error);
      }
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Deletes the current note
   */
  deleteNote(): void {
    if (!this.selectedNote?.id) return;

    if (showConfirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      this.isDeleting = true;
      this.error = null;

      this.notesService.deleteNote(this.selectedNote.id).subscribe({
        next: () => {
          this.isDeleting = false;
          this.noteDeleted.emit(this.selectedNote!.id!);
        },
        error: (error) => {
          this.isDeleting = false;
          this.error = 'Failed to delete note';
          console.error('Error deleting note:', error);
        }
      });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Closes the editor
   */
  closeEditor(): void {
    if (this.hasUnsavedChanges) {
      if (showConfirm('You have unsaved changes. Are you sure you want to close?')) {
        this.editorClosed.emit();
      }
    } else {
      this.editorClosed.emit();
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Checks if the save button should be disabled
   * @returns boolean True if save should be disabled
   */
  get isSaveDisabled(): boolean {
    return this.isSaving || (!this.title.trim() && !this.content.trim());
  }
}
