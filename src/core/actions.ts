import { immerable } from 'immer';

export enum ActionsIDs {
  SEND_MIGRATION_T45_LETTER,
  FINALIZE_MIGRATION_T45_STAGE,

  REQUEST_CONNECTION_INFO,
  RECEIVE_CONNECTION_INFO,
  PROPOSE_CONNECTION_TEST_DATE,
  CONFIRM_CONNECTION_TEST_DATE,
  CONNECTION_TEST_OK,
  CONNECTION_TEST_FAILED,
  FINALIZE_CONNECTION_STAGE,

  SEND_MIGRATION_T15_LETTER,
  FINALIZE_MIGRATION_T15_STAGE,

  SEND_MIGRATION_T5_LETTER,
  FINALIZE_MIGRATION_T5_STAGE,

  SEND_MIGRATION_T1_LETTER,
  FINALIZE_MIGRATION_T1_STAGE,

  GOLIVE,
  SEND_GOLIVE_LETTER,
  FINALIZE_RELEASE,

  ACKNOWLEDGE_MIGRATION_LETTER,
  POSTPONE_MIGRATION,
  RESUME_MIGRATION,
  SEND_REMINDER,
}

export enum ActionFlags {
  REMINDER,
  RELEASE_ACTION,
  EMAIL_PARTNERS,
  EMAIL_EJECTED_PARTNERS,
  EMAIL_CUSTOMER,
}

export type ActionEmailTemplateIds = {
  partners?: string;
  ejectedPartners?: string;
  customer?: string;
};

export class Action {
  [immerable] = true;
  readonly id: ActionsIDs;
  readonly label: string;
  readonly flags: ActionFlags[];
  readonly emailTemplateIds: ActionEmailTemplateIds;
  constructor(id: ActionsIDs, label: string, flags: ActionFlags[], emailTemplateIds: ActionEmailTemplateIds) {
    this.id = id;
    this.label = label;
    this.flags = flags;
    this.emailTemplateIds = emailTemplateIds;
  }
  toString(): string {
    return `[${this.label}]`;
  }

  static readonly SEND_MIGRATION_T45_LETTER = new Action(ActionsIDs.SEND_MIGRATION_T45_LETTER, 'Send migration T-45 letter', [ActionFlags.RELEASE_ACTION], { partners: 'T-45 letter', customer: 'T-45 letter' });
  static readonly ACKNOWLEDGE_MIGRATION_LETTER = new Action(ActionsIDs.ACKNOWLEDGE_MIGRATION_LETTER, 'Acknowledge migration letter', [], {});
  static readonly FINALIZE_MIGRATION_T45_STAGE = new Action(ActionsIDs.FINALIZE_MIGRATION_T45_STAGE, 'Finalize migration T-45 stage', [ActionFlags.RELEASE_ACTION], { ejectedPartners: 'Release ejection', customer: 'Report' });

  static readonly REQUEST_CONNECTION_INFO = new Action(ActionsIDs.REQUEST_CONNECTION_INFO, 'Request connection info', [], { partners: 'Connection info request' });
  static readonly RECEIVE_CONNECTION_INFO = new Action(ActionsIDs.RECEIVE_CONNECTION_INFO, 'Receive connection info', [], {});
  static readonly PROPOSE_CONNECTION_TEST_DATE = new Action(ActionsIDs.PROPOSE_CONNECTION_TEST_DATE, 'Propose connection test date', [], { partners: 'Connection test date proposition' });
  static readonly CONFIRM_CONNECTION_TEST_DATE = new Action(ActionsIDs.CONFIRM_CONNECTION_TEST_DATE, 'Confirm connection test date', [], {});
  static readonly CONNECTION_TEST_OK = new Action(ActionsIDs.CONNECTION_TEST_OK, 'Connection test ok', [], {});
  static readonly CONNECTION_TEST_FAILED = new Action(ActionsIDs.CONNECTION_TEST_FAILED, 'Connection test failed', [], {});
  static readonly FINALIZE_CONNECTION_STAGE = new Action(ActionsIDs.FINALIZE_CONNECTION_STAGE, 'Finalize connection stage', [ActionFlags.RELEASE_ACTION], { ejectedPartners: 'Release ejection', customer: 'Report' });

  static readonly SEND_MIGRATION_T15_LETTER = new Action(ActionsIDs.SEND_MIGRATION_T15_LETTER, 'Send migration T-15 letter', [ActionFlags.RELEASE_ACTION], { partners: 'T-14 letter', customer: 'T-14 letter' });
  static readonly FINALIZE_MIGRATION_T15_STAGE = new Action(ActionsIDs.FINALIZE_MIGRATION_T15_STAGE, 'Finalize migration T-15 stage', [ActionFlags.RELEASE_ACTION], { ejectedPartners: 'Release ejection', customer: 'Report' });

  static readonly SEND_MIGRATION_T5_LETTER = new Action(ActionsIDs.SEND_MIGRATION_T5_LETTER, 'Send migration T-5 letter', [ActionFlags.RELEASE_ACTION], { partners: 'T-5 letter', customer: 'T-5 letter' });
  static readonly FINALIZE_MIGRATION_T5_STAGE = new Action(ActionsIDs.FINALIZE_MIGRATION_T5_STAGE, 'Finalize migration T-5 stage', [ActionFlags.RELEASE_ACTION], { ejectedPartners: 'Release ejection', customer: 'Report' });

  static readonly SEND_MIGRATION_T1_LETTER = new Action(ActionsIDs.SEND_MIGRATION_T1_LETTER, 'Send migration T-1 letter', [ActionFlags.RELEASE_ACTION], { partners: 'T-1 letter', customer: 'T-1 letter' });
  static readonly FINALIZE_MIGRATION_T1_STAGE = new Action(ActionsIDs.FINALIZE_MIGRATION_T1_STAGE, 'Finalize migration T-1 stage', [ActionFlags.RELEASE_ACTION], { ejectedPartners: 'Release ejection', customer: 'Report' });

  static readonly GOLIVE = new Action(ActionsIDs.GOLIVE, 'GoLive', [ActionFlags.RELEASE_ACTION], {});
  static readonly SEND_GOLIVE_LETTER = new Action(ActionsIDs.SEND_GOLIVE_LETTER, 'Send GoLive letter', [], { partners: 'Send load' });
  static readonly FINALIZE_RELEASE = new Action(ActionsIDs.FINALIZE_RELEASE, 'Finalize release', [ActionFlags.RELEASE_ACTION], { partners: 'Release OK', ejectedPartners: 'Release ejection', customer: 'Report' });

  static readonly POSTPONE_MIGRATION = new Action(ActionsIDs.POSTPONE_MIGRATION, 'Postpone migration', [ActionFlags.RELEASE_ACTION], { partners: 'Migration postponed', customer: 'Migration postponed' });
  static readonly RESUME_MIGRATION = new Action(ActionsIDs.RESUME_MIGRATION, 'Resume migration', [ActionFlags.RELEASE_ACTION], { partners: 'Migration resumed', customer: 'Migration resumed' });
  static readonly SEND_REMINDER = new Action(ActionsIDs.SEND_REMINDER, 'Send reminder', [ActionFlags.REMINDER], { partners: 'Reminder' });
}
