export type PromptDto = {
  type: string;
  name: string;
  message: string;
  choices?: Array<any>;
};

export enum Status {
  UNEXPECTED_ERROR = 0,
  ERROR = 1,
  SUCCESS = 2,
}
