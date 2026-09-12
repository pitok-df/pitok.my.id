import type { ReactNode } from "react";
import type {
  Control,
  FieldValues,
  Path,
  DefaultValues,
  ControllerRenderProps,
  UseFormReturn,
  UseFieldArrayReturn,
  ArrayPath,
  FieldArray,
} from "react-hook-form";
import type { ZodType } from "zod";
import type { DropzoneOptions } from "react-dropzone";
import type { FileUploaderVariant } from "./image-uploader";


export type FieldType =
  | "text"
  | "email"
  | "password"
  | "file"
  | "date"
  | "number"
  | "select"
  | "multi-select"
  | "textarea"
  | "currency"
  | "custom"
  | "tel"
  | "toggle"
  | "dual-option-switch"
  | "datetime-local"
  | "percentage"
  | "array";


type PlaceholderFn<T extends FieldValues> = (values: Partial<T>) => string;
export type PlaceholderResolver<T extends FieldValues> =
  | string
  | PlaceholderFn<T>;


export const COL_SPAN_CLASS = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  12: "md:col-span-12",
  full: "md:col-span-full",
} as const;

export const GRID_COLS_CLASS = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
} as const;

export type ColSpan = keyof typeof COL_SPAN_CLASS;
export type GridCols = keyof typeof GRID_COLS_CLASS;


export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  details?: ApiErrorDetail[];
}


export type CustomRenderInput<T extends FieldValues> = (props: {
  field: ControllerRenderProps<T, Path<T>>;
  values: Partial<T>;
  form: UseFormReturn<T>;
}) => ReactNode;


interface BaseFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: PlaceholderResolver<T>;
  description?: string;
  disabled?: boolean;
  className?: string;
  valueToUpperCase?: boolean;
  colSpan?: ColSpan;
  icon?: React.ComponentType<{ className?: string }>;
  condition?: (values: Partial<T>) => boolean;
  typeResolver?: (values: Partial<T>) => FieldType;
  dependsOn?: {
    field: Path<T>;
    condition: (value: unknown, allValues: Partial<T>) => boolean;
    then?: (
      fieldConfig: FormFieldConfig<T>,
    ) => Partial<FormFieldConfig<T>>;
  };
}


export interface TextFieldConfig<T extends FieldValues>
  extends BaseFieldConfig<T> {
  type?: Exclude<
    FieldType,
    | "select"
    | "multi-select"
    | "toggle"
    | "dual-option-switch"
    | "file"
    | "custom"
    | "array"
  >;
}

export interface SelectFieldConfig<T extends FieldValues>
  extends BaseFieldConfig<T> {
  type: "select";
  options: { label: string; value: string }[];
}

export interface MultiSelectFieldConfig<T extends FieldValues>
  extends BaseFieldConfig<T> {
  type: "multi-select";
  options: { label: string; value: string }[];
  maxItems?: number;
}

export interface ToggleFieldConfig<T extends FieldValues>
  extends BaseFieldConfig<T> {
  type: "toggle";
  options: { label: string; value: string; disabled?: boolean }[];
}

export interface DualSwitchFieldConfig<T extends FieldValues>
  extends BaseFieldConfig<T> {
  type: "dual-option-switch";
  switchOptions: {
    left: {
      label: string;
      value: unknown;
      activeClass?: string;
      icon?: React.ComponentType<{ className?: string }>;
    };
    right: {
      label: string;
      value: unknown;
      activeClass?: string;
      icon?: React.ComponentType<{ className?: string }>;
    };
  };
}

export interface FileFieldConfig<T extends FieldValues>
  extends BaseFieldConfig<T> {
  type: "file";
  accept?: DropzoneOptions["accept"];
  maxSizes?: number;
  variant?: FileUploaderVariant;
}

export interface CustomFieldConfig<T extends FieldValues>
  extends BaseFieldConfig<T> {
  type: "custom";
  renderCustom: CustomRenderInput<T>;
}

export interface ArrayFieldConfig<T extends FieldValues>
  extends Omit<BaseFieldConfig<T>, "name"> {
  type: "array";
  name: ArrayPath<T>;
  arrayFields: FormFieldConfig<T>[];
  defaultItem?: Partial<FieldArray<T, ArrayPath<T>>>;
  renderItem?: (
    index: number,
    remove: () => void,
    fieldsArray: UseFieldArrayReturn<T, ArrayPath<T>>,
  ) => ReactNode;
  addButtonText?: string;
  removeButtonText?: string;
}


export type FormFieldConfig<T extends FieldValues> =
  | SelectFieldConfig<T>
  | MultiSelectFieldConfig<T>
  | ToggleFieldConfig<T>
  | DualSwitchFieldConfig<T>
  | FileFieldConfig<T>
  | CustomFieldConfig<T>
  | ArrayFieldConfig<T>
  | TextFieldConfig<T>;


export interface WizardStep<T extends FieldValues> {
  title: string;
  fields: Path<T>[];
  description?: string;
}


export interface AutoSaveConfig<T extends FieldValues> {
  enabled: boolean;
  delay?: number;
  onSave?: (data: Partial<T>) => void;
  storageKey?: string;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyForm<T extends FieldValues> = UseFormReturn<T, any, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySchema<T extends FieldValues> = ZodType<T, any, any>;

interface SharedFormProps<T extends FieldValues> {
  form?: AnyForm<T>;
  schema: AnySchema<T>;
  defaultValues?: DefaultValues<T>;
  fields: FormFieldConfig<T>[];
  submitText?: string;
  loadingText?: string;
  isLoading?: boolean;
  submitDisabled?: boolean;
  gridCols?: GridCols;
  children?: ReactNode;
  header?: ReactNode;
  renderFooter?: ReactNode;
  onValuesChange?: (values: Partial<T>) => void;
  hideSubmitButton?: boolean;
  id?: string;
  className?: string;
  errorSummary?: boolean;
  autoSave?: AutoSaveConfig<T>;
  steps?: WizardStep<T>[];
}

export interface DialogProps {
  withDialog: true;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  dialogTitle?: ReactNode;
  dialogDescription?: ReactNode;
  showDialogCloseButton?: boolean;
  cancelText?: string;
  resetFormOnClose?: boolean;
  preventClose?: boolean;
  confirmClose?: boolean;
  confirmCloseMessage?: string;
}

interface NoDialogProps {
  withDialog?: false;
}

interface WithFormDataProps<T extends FieldValues> extends SharedFormProps<T> {
  useFormData: true;
  onSubmit: (values: FormData) => void | Promise<void>;
}

interface WithoutFormDataProps<T extends FieldValues>
  extends SharedFormProps<T> {
  useFormData?: false;
  onSubmit: (values: NoInfer<T>) => void | Promise<void>;
}

type BaseFormProps<T extends FieldValues> =
  | WithFormDataProps<T>
  | WithoutFormDataProps<T>;

export type FormBuilderProps<T extends FieldValues> = BaseFormProps<T> &
  (DialogProps | NoDialogProps);


export type { Control, FieldValues, Path, UseFormReturn, ArrayPath, FieldArray };
