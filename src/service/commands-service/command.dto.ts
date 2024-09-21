export type VariantDto = {
  name?: string;
  dbName?: string;
  n?: string;
  db?: string;
};

export enum ECommands {
  CRUD = 'crud',
  CRON = 'cron'
}
