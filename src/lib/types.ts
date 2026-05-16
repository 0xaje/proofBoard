export type FieldType = 
  | "text" 
  | "textarea" 
  | "select" 
  | "checkbox" 
  | "rating" 
  | "url" 
  | "file";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select and checkbox
}

export interface FormSchema {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  owner: string;
  isEncrypted?: boolean;
}

export interface FormSubmission {
  formId: string;
  submissionId: string;
  responses: Record<string, any>;
  timestamp: string;
  isEncrypted: boolean;
  walrusBlobId?: string;
}
