import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { DoctorTicketsFacade } from '../../services/doctor-tickets.facade';
import { StatusInfoComponent } from '../../../payments/components/status-info';
import { ModalService } from '../../../../shared/services/model.service';
import { ITicketCreateRequestDto } from '../../dtos/requests';

interface ComplaintType {
    label: string;
    value: string;
}

@Component({
    selector: 'app-report-complaint',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, DropdownModule],
    templateUrl: './report-complaint.component.html',
    styleUrls: ['./report-complaint.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComplaintComponent implements OnInit {
    @Output() submitComplaint = new EventEmitter<any>();
    @Output() closed = new EventEmitter<void>();

    complaintForm: FormGroup;
    selectedImages: string[] = [];
    isLoading = false;


    // Inject facade
    private doctorTicketsFacade = inject(DoctorTicketsFacade);
    protected readonly problems = this.doctorTicketsFacade.problems;
    protected readonly isLoadingProblems = this.doctorTicketsFacade.isLoadingProblems;
    protected readonly isLoadingCreateTicket = this.doctorTicketsFacade.isCreatingTicket;
    protected readonly errorMessageProblems = this.doctorTicketsFacade.errorMessageProblems;

    private modalService = inject(ModalService);

    constructor(private fb: FormBuilder) {
        this.complaintForm = this.fb.group({
            type: ['', Validators.required],
            details: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit(): void {
        this.doctorTicketsFacade.fetchDoctorTicketProblems();
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.complaintForm.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    getDetailsErrorMessage(): string {
        const detailsControl = this.complaintForm.get('details');
        if (detailsControl?.errors?.['required']) {
            return 'complaints.report.errors.detailsRequired';
        }
        if (detailsControl?.errors?.['minlength']) {
            return 'complaints.report.errors.detailsMinLength';
        }
        return '';
    }

    onFileSelected(event: Event): void {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) {
                        this.selectedImages.push(result);
                    }
                };

                reader.readAsDataURL(file);
            }
        }
    }

    removeImage(index: number): void {
        this.selectedImages.splice(index, 1);
    }

    onSubmit(): void {
        if (this.complaintForm.invalid) {
            this.complaintForm.markAllAsTouched();
            return;
        }
        if (this.complaintForm.valid) {
            // Remove local isLoading, use facade signal

            const payload: ITicketCreateRequestDto = {
                problem_id: this.complaintForm.value.type,
                description: this.complaintForm.value.details,
                images: this.selectedImages // adjust if you want to send File[]
            };

            this.doctorTicketsFacade.createTicket(payload).subscribe({
                next: (res) => {
                    this.complaintForm.reset();
                    this.selectedImages = [];
                    const modalRef = this.modalService.open(StatusInfoComponent, {
                        inputs: {
                            data: {
                                item: { storeSuccess: true },
                                statusLabels: {
                                    successTitle: 'complaints.report.status.successTitle',
                                    successSubTitle: 'complaints.report.status.successSubTitle',
                                    errorTitle: 'complaints.report.status.errorTitle',
                                    errorSubTitle: 'complaints.report.status.errorSubTitle',
                                }
                            }
                        },
                        outputs: {
                            closed: () => {
                                this.doctorTicketsFacade.fetchDoctorTicketProblems();
                            }
                        },
                        width: '40%',
                        isPhoneFromDown: true,
                        minHeight: '10rem',
                        maxHeight: '60rem'
                    });
                    this.closed.emit();
                },
                error: (err) => {
                    this.modalService.open(StatusInfoComponent, {
                        inputs: {
                            data: {
                                item: { storeSuccess: false, storeError: 'complaints.report.status.errorSubTitle' },
                                statusLabels: {
                                    successTitle: 'complaints.report.status.successTitle',
                                    successSubTitle: 'complaints.report.status.successSubTitle',
                                    errorTitle: 'complaints.report.status.errorTitle',
                                    errorSubTitle: 'complaints.report.status.errorSubTitle',
                                }
                            }
                        },
                        width: '40%',
                        isPhoneFromDown: true,
                        minHeight: '10rem',
                        maxHeight: '60rem'
                    });
                }
            });
        }
    }
} 