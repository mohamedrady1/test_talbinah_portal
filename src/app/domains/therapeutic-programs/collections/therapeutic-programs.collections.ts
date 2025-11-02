export class TherapeuticProgramsManagementCollections {
  static ModuleName: string = 'api';

  static TherapeuticPrograms: string = `${TherapeuticProgramsManagementCollections.ModuleName}`;

  static AllTherapeuticProgramsListing(): string {
    return `${TherapeuticProgramsManagementCollections.TherapeuticPrograms}/programmes`;
  }

  static getMyPrograms(): string {
    return `${TherapeuticProgramsManagementCollections.TherapeuticPrograms}/programmes/my-programs`;
  }

  static getTherapeuticProgramById(id: number): string {
    return `${TherapeuticProgramsManagementCollections.TherapeuticPrograms}/programmes/${id}`;
  }

  static storeProgramme(): string {
    return `${TherapeuticProgramsManagementCollections.TherapeuticPrograms}/programmes/store`;
  }
}
