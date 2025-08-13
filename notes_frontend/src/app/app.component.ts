import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { Note } from './models/note.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, SidebarComponent, NoteEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  
  selectedNote: Note | null = null;
  isCreatingNew: boolean = false;
  isMobileMenuOpen: boolean = false;

  // PUBLIC_INTERFACE
  /**
   * Handles note selection from sidebar
   * @param note The selected note
   */
  onNoteSelected(note: Note): void {
    this.selectedNote = note;
    this.isCreatingNew = false;
    this.closeMobileMenu();
  }

  // PUBLIC_INTERFACE
  /**
   * Handles creating a new note
   */
  onCreateNewNote(): void {
    this.selectedNote = null;
    this.isCreatingNew = true;
    this.closeMobileMenu();
  }

  // PUBLIC_INTERFACE
  /**
   * Handles note save completion
   * @param note The saved note
   */
  onNoteSaved(note: Note): void {
    this.selectedNote = note;
    this.isCreatingNew = false;
    this.sidebar.refreshNotes();
  }

  // PUBLIC_INTERFACE
  /**
   * Handles note deletion
   * @param _noteId The ID of the deleted note
   */
  onNoteDeleted(_noteId: number): void {
    // noteId is passed but not used locally - it's handled by the sidebar refresh
    this.selectedNote = null;
    this.isCreatingNew = false;
    this.sidebar.refreshNotes();
  }

  // PUBLIC_INTERFACE
  /**
   * Handles editor close
   */
  onEditorClosed(): void {
    this.selectedNote = null;
    this.isCreatingNew = false;
  }

  // PUBLIC_INTERFACE
  /**
   * Toggles mobile menu
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // PUBLIC_INTERFACE
  /**
   * Closes mobile menu
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
