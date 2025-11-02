import { Component, OnInit, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalSearchComponent } from '../../../../shared/components/local-search/local-search.component';
import { ComplaintCardComponent, IComplaint } from '../complaint-card/complaint-card.component';
import { ComplaintDetailsComponent } from '../complaint-details/complaint-details.component';
import { ReportComplaintComponent } from '../report-complaint/report-complaint.component';
import { ModalService } from '../../../../shared';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { DoctorTicketsFacade } from '../../services/doctor-tickets.facade';
import { EmptyStateCardComponent, ErrorStateCardComponent } from '../../../../shared';
import { ComplaintCardSkeletonComponent } from '../complaint-card-skeleton/complaint-card-skeleton.component';
import { complaintsEmptyState, complaintsErrorState } from '../../configs/complaints.config';
import { TranslateApiPipe } from '../../../../common/core/translations';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-complaints-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateApiPipe,
    LocalSearchComponent,
    ComplaintCardComponent,
    EmptyStateCardComponent,
    ErrorStateCardComponent,
    ComplaintCardSkeletonComponent,
    AutoExactHeightDirective
  ],
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplaintsListComponent implements OnInit {
  searchTerm = signal('');
  activeFilter = signal('all');

  filters: FilterOption[] = [
    { label: 'all', value: 'all' },
    { label: 'pending', value: 'pending' },
    { label: 'resolved', value: 'resolved' }
  ];

  private readonly modalService = inject(ModalService);
  private readonly doctorTicketsFacade = inject(DoctorTicketsFacade);

  // Use facade signals
  readonly tickets = this.doctorTicketsFacade.tickets;
  readonly isLoading = this.doctorTicketsFacade.isLoading;
  readonly errorMessage = this.doctorTicketsFacade.errorMessage;
  readonly status = this.doctorTicketsFacade.status;

  // Empty state configuration
  readonly complaintsEmptyState = complaintsEmptyState;

  // Error state configuration
  readonly complaintsErrorState = complaintsErrorState(() => this.loadComplaints());

  // Computed filtered complaints
  readonly filteredComplaints = computed(() => {
    let filtered = this.tickets();

    // Apply status filter
    if (this.activeFilter() !== 'all') {
      const statusValue = this.activeFilter() === 'pending' ? '-1' : '1';
      filtered = filtered.filter(ticket => ticket.status === statusValue);
    }

    // Apply search filter
    if (this.searchTerm()) {
      const searchTerm = this.searchTerm().toLowerCase();
      filtered = filtered.filter(ticket =>
        (ticket.problem?.problem || ticket.other_problem || '').toLowerCase().includes(searchTerm) ||
        (ticket.description || '').toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  });

  ngOnInit(): void {
    this.loadComplaints();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
  }

  onFilterChange(filter: string): void {
    this.activeFilter.set(filter);
  }

  onComplaintClick(complaint: IComplaint): void {
    this.modalService.open(ComplaintDetailsComponent, {
      inputs: {
        image: 'images/settings/modal-icons/complaints.png',
        title: 'complaint_details',
        item: complaint
      },
      width: '40%',
      isPhoneFromDown: true
    });
  }

  onReportClick(): void {
    this.modalService.open(ReportComplaintComponent, {
      inputs: {
        image: 'images/settings/modal-icons/complaints.png',
        title: 'report_issue2'
      },
      outputs: {
        closed: (data: any): void => {
          Logger.debug('Modal closed with data:', data);
          // Refresh complaints after report submission
          this.loadComplaints();
        }
      },
      width: '40%',
      isPhoneFromDown: true
    });
  }

  loadComplaints(): void {
    this.doctorTicketsFacade.fetchDoctorTickets();
  }
}
