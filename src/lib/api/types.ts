export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  cvec_paid: boolean;
  cvec_paid_at: string | null;
}

export interface ApiClass {
  id: number;
  label: string;
}



export interface ApiDocument {
  id: number;
  user_id: number;
  type: string;
  file_path: string;
  status: string;
  validated_by_user_id: number | null;
  validated_at: string | null;
}

export interface ApiPaymentResult {
  paymentId: number;
  status: "validated" | "rejected";
}

export interface ApiPlanningSlot {
  slot_id: number;
  course_label: string;
  room: string;
  date: string; // YYYY-MM-DD
  start_time: string; // "09:00"
  end_time: string; // "10:30"
  class_id: number;
  class_label: string;
  teacher_user_id: number;
  teacher_name: string;
}
export interface ApiPlanningSlot {
  slot_id: number;
  course_label: string;
  room: string;
  date: string;        // "2025-12-05T00:00:00.000Z"
  start_time: string;  // "09:00:00"
  end_time: string;    // "11:00:00"
  class_id: number;
  class_label: string;
  teacher_user_id: number;
  teacher_name: string;
}

export interface ApiNote {
  id?: number;
  student_user_id: number | null;
  teacher_user_id: number | null;
  class_id: number | null;
  value: string | number; // en vrai, le back renvoie une string
  ects: number | string;
}

/**
 
Vue simplifiée pour les notes étudiant, pour le tableau du dashboard.*/
export interface StudentNoteView {
  classLabel: string;
  value: number;
  ects: number;
}