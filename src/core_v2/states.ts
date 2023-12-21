import { immerable } from 'immer';

export enum StatesEnum {
  START,
  MIGRATION_T45_LETTER_SENT,
  MIGRATION_T45_LETTER_ACKNOWLEDGED,
  MIGRATION_T45_STAGE_COMPLETE,

  CONNECTION_INFO_REQUESTED,
  CONNECTION_INFO_RECEIVED,
  CONNECTION_TEST_DATE_PROPOSED,
  CONNECTION_TEST_DATE_CONFIRMED,
  CONNECTION_TEST_OK,
  CONNECTION_STAGE_COMPLETE,

  MIGRATION_T15_LETTER_SENT,
  MIGRATION_T15_LETTER_ACKNOWLEDGED,
  MIGRATION_T15_STAGE_COMPLETE,
  MIGRATION_T5_LETTER_SENT,
  MIGRATION_T5_LETTER_ACKNOWLEDGED,
  MIGRATION_T5_STAGE_COMPLETE,
  MIGRATION_T1_LETTER_SENT,
  MIGRATION_T1_LETTER_ACKNOWLEDGED,
  MIGRATION_T1_STAGE_COMPLETE,
  GOLIVE,
  GOLIVE_LETTER_SENT,
  RELEASE_COMPLETE,

  EJECTED,
  CONNECTION_TEST_FAILED,
  MIGRATION_POSTPONED,
  CONNECTION_RETEST_DUE
}

export class CState {
  [immerable] = true;
  readonly id: StatesEnum;
  readonly label: string;
  readonly awaitingReply: boolean;
  readonly alongMainPath: boolean;
  readonly errorState: boolean;
  constructor(id: StatesEnum, label: string, awaitingReply: boolean, alongMainPath: boolean, errorState: boolean) {
    this.id = id;
    this.label = label;
    this.awaitingReply = awaitingReply;
    this.alongMainPath = alongMainPath;
    this.errorState = errorState;
  }
  toString(): string {
    return this.label;
  }

  static readonly START = new CState(StatesEnum.START, 'Start', false, true, false);
  static readonly MIGRATION_T45_LETTER_SENT = new CState(StatesEnum.MIGRATION_T45_LETTER_SENT, 'Migration T-45 letter sent', true, true, false);
  static readonly MIGRATION_T45_LETTER_ACKNOWLEDGED = new CState(StatesEnum.MIGRATION_T45_LETTER_ACKNOWLEDGED, 'Migration T-45 letter acknowledged', false, true, false);
  static readonly MIGRATION_T45_STAGE_COMPLETE = new CState(StatesEnum.MIGRATION_T45_STAGE_COMPLETE, 'Migration T-45 stage complete', false, true, false);

  static readonly CONNECTION_INFO_REQUESTED = new CState(StatesEnum.CONNECTION_INFO_REQUESTED, 'Connection info requested', true, true, false);
  static readonly CONNECTION_INFO_RECEIVED = new CState(StatesEnum.CONNECTION_INFO_RECEIVED, 'Connection info received', false, true, false);
  static readonly CONNECTION_TEST_DATE_PROPOSED = new CState(StatesEnum.CONNECTION_TEST_DATE_PROPOSED, 'Connection test date proposed', true, true, false);
  static readonly CONNECTION_TEST_DATE_CONFIRMED = new CState(StatesEnum.CONNECTION_TEST_DATE_CONFIRMED, 'Connection test date confirmed', false, true, false);
  static readonly CONNECTION_TEST_OK = new CState(StatesEnum.CONNECTION_TEST_OK, 'Connection test ok', false, true, false);
  static readonly CONNECTION_STAGE_COMPLETE = new CState(StatesEnum.CONNECTION_STAGE_COMPLETE, 'Connection stage complete', false, true, false);

  static readonly MIGRATION_T15_LETTER_SENT = new CState(StatesEnum.MIGRATION_T15_LETTER_SENT, 'Migration T-15 letter sent', true, true, false);
  static readonly MIGRATION_T15_LETTER_ACKNOWLEDGED = new CState(StatesEnum.MIGRATION_T15_LETTER_ACKNOWLEDGED, 'Migration T-15 letter acknowledged', false, true, false);
  static readonly MIGRATION_T15_STAGE_COMPLETE = new CState(StatesEnum.MIGRATION_T15_STAGE_COMPLETE, 'Migration T-15 stage complete', false, true, false);
  static readonly MIGRATION_T5_LETTER_SENT = new CState(StatesEnum.MIGRATION_T5_LETTER_SENT, 'Migration T-5 letter sent', true, true, false);
  static readonly MIGRATION_T5_LETTER_ACKNOWLEDGED = new CState(StatesEnum.MIGRATION_T5_LETTER_ACKNOWLEDGED, 'Migration T-5 letter acknowledged', false, true, false);
  static readonly MIGRATION_T5_STAGE_COMPLETE = new CState(StatesEnum.MIGRATION_T5_STAGE_COMPLETE, 'Migration T-5 stage complete', false, true, false);
  static readonly MIGRATION_T1_LETTER_SENT = new CState(StatesEnum.MIGRATION_T1_LETTER_SENT, 'Migration T-1 letter sent', true, true, false);
  static readonly MIGRATION_T1_LETTER_ACKNOWLEDGED = new CState(StatesEnum.MIGRATION_T1_LETTER_ACKNOWLEDGED, 'Migration T-1 letter acknowledged', false, true, false);
  static readonly MIGRATION_T1_STAGE_COMPLETE = new CState(StatesEnum.MIGRATION_T1_STAGE_COMPLETE, 'Migration T-1 stage complete', false, true, false);
  static readonly GOLIVE = new CState(StatesEnum.GOLIVE, 'Migration done', false, true, false);
  static readonly GOLIVE_LETTER_SENT = new CState(StatesEnum.GOLIVE_LETTER_SENT, 'Golive letter sent', true, false, false);
  static readonly RELEASE_COMPLETE = new CState(StatesEnum.RELEASE_COMPLETE, 'Release complete', false, true, false);

  static readonly EJECTED = new CState(StatesEnum.EJECTED, 'Ejected', false, false, true);
  static readonly CONNECTION_TEST_FAILED = new CState(StatesEnum.CONNECTION_TEST_FAILED, 'Connection test failed', false, false, true);
  static readonly MIGRATION_POSTPONED = new CState(StatesEnum.MIGRATION_POSTPONED, 'Migration postponed', false, true, true);
  static readonly CONNECTION_RETEST_DUE = new CState(StatesEnum.CONNECTION_TEST_FAILED, 'Connection retest due', false, false, true);
}
