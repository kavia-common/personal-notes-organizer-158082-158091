import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Output() noteSelected = new EventEmitter<Note>();
  @Output() createNewNote = new EventEmitter<void>();

  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchQuery: string = '';
  selectedNoteId: number | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  // PUBLIC_INTERFACE
  /**
   * Loads all notes from the backend
   */
  loadNotes(): void {
    this.isLoading = true;
    this.error = null;
    
    this.notesService.getAllNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.filteredNotes = notes;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load notes';
        this.isLoading = false;
        console.error('Error loading notes:', error);
      }
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Filters notes based on search query
   */
  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredNotes = this.notes;
    } else {
      this.notesService.searchNotes(this.searchQuery).subscribe({
        next: (notes) => {
          this.filteredNotes = notes;
        },
        error: (error) => {
          console.error('Error searching notes:', error);
          // Fallback to local search if API search fails
          this.filteredNotes = this.notes.filter(note =>
            note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
        }
      });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Handles note selection from the list
   * @param note The selected note
   */
  onNoteSelect(note: Note): void {
    this.selectedNoteId = note.id || null;
    this.noteSelected.emit(note);
  }

  // PUBLIC_INTERFACE
  /**
   * Triggers creation of a new note
   */
  onCreateNew(): void {
    this.selectedNoteId = null;
    this.createNewNote.emit();
  }

  // PUBLIC_INTERFACE
  /**
   * Refreshes the notes list after external changes
   */
  refreshNotes(): void {
    this.loadNotes();
  }
}
