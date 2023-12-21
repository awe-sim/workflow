import { immerable } from 'immer';
import { CState } from './states';

export enum ActionsEnum {
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
  SEND_REMINDER
}

export enum ActionEmailAudienceEnum {
  EJECTED_PARTNERS,
  NON_EJECTED_PARTNERS,
  CUSTOMER
}

export type ActionFlags = {
  isReleaseAction?: boolean;
  blockForStates?: CState[];
  emailAudience?: ActionEmailAudienceEnum[];
};

export class CAction {
  [immerable] = true;
  readonly id: ActionsEnum;
  readonly label: string;
  readonly flags: ActionFlags;
  constructor(id: ActionsEnum, label: string, flags: ActionFlags) {
    this.id = id;
    this.label = label;
    this.flags = flags;
  }
  toString(): string {
    return `[${this.label}]`;
  }

  static readonly SEND_MIGRATION_T45_LETTER = new CAction(ActionsEnum.SEND_MIGRATION_T45_LETTER, 'Send migration T-45 letter', {
    isReleaseAction: true,
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });
  static readonly FINALIZE_MIGRATION_T45_STAGE = new CAction(ActionsEnum.FINALIZE_MIGRATION_T45_STAGE, 'Finalize migration T-45 stage', {
    isReleaseAction: true,
    emailAudience: [ActionEmailAudienceEnum.EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });

  static readonly REQUEST_CONNECTION_INFO = new CAction(ActionsEnum.REQUEST_CONNECTION_INFO, 'Request connection info', {
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS]
  });
  static readonly RECEIVE_CONNECTION_INFO = new CAction(ActionsEnum.RECEIVE_CONNECTION_INFO, 'Receive connection info', {});
  static readonly PROPOSE_CONNECTION_TEST_DATE = new CAction(ActionsEnum.PROPOSE_CONNECTION_TEST_DATE, 'Propose connection test date', {
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS]
  });
  static readonly CONFIRM_CONNECTION_TEST_DATE = new CAction(ActionsEnum.CONFIRM_CONNECTION_TEST_DATE, 'Confirm connection test date', {});
  static readonly CONNECTION_TEST_OK = new CAction(ActionsEnum.CONNECTION_TEST_OK, 'Connection test ok', {});
  static readonly CONNECTION_TEST_FAILED = new CAction(ActionsEnum.CONNECTION_TEST_FAILED, 'Connection test failed', {});
  static readonly FINALIZE_CONNECTION_STAGE = new CAction(ActionsEnum.FINALIZE_CONNECTION_STAGE, 'Finalize connection stage', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });

  static readonly SEND_MIGRATION_T15_LETTER = new CAction(ActionsEnum.SEND_MIGRATION_T15_LETTER, 'Send migration T-15 letter', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });
  static readonly FINALIZE_MIGRATION_T15_STAGE = new CAction(ActionsEnum.FINALIZE_MIGRATION_T15_STAGE, 'Finalize migration T-15 stage', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE, CState.CONNECTION_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });

  static readonly SEND_MIGRATION_T5_LETTER = new CAction(ActionsEnum.SEND_MIGRATION_T5_LETTER, 'Send migration T-5 letter', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE, CState.CONNECTION_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });
  static readonly FINALIZE_MIGRATION_T5_STAGE = new CAction(ActionsEnum.FINALIZE_MIGRATION_T5_STAGE, 'Finalize migration T-5 stage', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE, CState.CONNECTION_STAGE_COMPLETE, CState.MIGRATION_T15_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });

  static readonly SEND_MIGRATION_T1_LETTER = new CAction(ActionsEnum.SEND_MIGRATION_T1_LETTER, 'Send migration T-1 letter', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE, CState.CONNECTION_STAGE_COMPLETE, CState.MIGRATION_T15_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });
  static readonly FINALIZE_MIGRATION_T1_STAGE = new CAction(ActionsEnum.FINALIZE_MIGRATION_T1_STAGE, 'Finalize migration T-1 stage', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE, CState.CONNECTION_STAGE_COMPLETE, CState.MIGRATION_T15_STAGE_COMPLETE, CState.MIGRATION_T5_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });

  static readonly GOLIVE = new CAction(ActionsEnum.GOLIVE, 'GoLive', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE, CState.CONNECTION_STAGE_COMPLETE, CState.MIGRATION_T15_STAGE_COMPLETE, CState.MIGRATION_T5_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });
  static readonly SEND_GOLIVE_LETTER = new CAction(ActionsEnum.SEND_GOLIVE_LETTER, 'Send GoLive letter', {
    isReleaseAction: true,
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS]
  });
  static readonly FINALIZE_RELEASE = new CAction(ActionsEnum.FINALIZE_RELEASE, 'Finalize release', {
    isReleaseAction: true,
    blockForStates: [CState.MIGRATION_T45_STAGE_COMPLETE, CState.CONNECTION_STAGE_COMPLETE, CState.MIGRATION_T15_STAGE_COMPLETE, CState.MIGRATION_T5_STAGE_COMPLETE, CState.MIGRATION_T1_STAGE_COMPLETE],
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });

  static readonly ACKNOWLEDGE_MIGRATION_LETTER = new CAction(ActionsEnum.ACKNOWLEDGE_MIGRATION_LETTER, 'Acknowledge migration letter', {
    emailAudience: []
  });
  static readonly POSTPONE_MIGRATION = new CAction(ActionsEnum.POSTPONE_MIGRATION, 'Postpone migration', {
    isReleaseAction: true,
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });
  static readonly RESUME_MIGRATION = new CAction(ActionsEnum.RESUME_MIGRATION, 'Resume migration', {
    isReleaseAction: true,
    emailAudience: [ActionEmailAudienceEnum.NON_EJECTED_PARTNERS, ActionEmailAudienceEnum.CUSTOMER]
  });
  static readonly SEND_REMINDER = new CAction(ActionsEnum.SEND_REMINDER, 'Send reminder', {});
}
