export interface Campus {
    name: string,
    faculties: Array<string>;
}

export interface Faculty {
    name: string,
    campus: string,
    professors?: Array<string>,
    buildings?: Array<string>
}

export interface CampusAndFaculties {
  campus: Campus
  faculties: Faculty[]
}

export interface Professor {
  id?: string,
  name: string
  faculty: string
  campus: string
  infoId?: string
  isVisible: boolean
}

export interface ProfessorDetail {
  uuid: string
  category: string
  dedication: string
  phoneNumber?: string
  schedule: {
    first: string
    second: string
  }
}