import { immerable } from 'immer';

export enum StatesIDs {
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
  CONNECTION_RETEST_DUE,
}

export enum StateFlags {
  HAPPY_PATH,
  AWAITING_REPLY,
  ERROR_STATE,
  STARTING_STATE,
  ENDING_STATE,
}

export class State {
  [immerable] = true;
  readonly id: StatesIDs;
  readonly label: string;
  readonly flags: StateFlags[];
  constructor(id: StatesIDs, label: string, flags: StateFlags[]) {
    this.id = id;
    this.label = label;
    this.flags = flags;
  }
  toString(): string {
    return this.label;
  }

  static readonly START                             = new State(StatesIDs.START,                             'Start',                              [StateFlags.HAPPY_PATH, StateFlags.STARTING_STATE]);
  static readonly MIGRATION_T45_LETTER_SENT         = new State(StatesIDs.MIGRATION_T45_LETTER_SENT,         'Migration T-45 letter sent',         [StateFlags.HAPPY_PATH, StateFlags.AWAITING_REPLY]);
  static readonly MIGRATION_T45_LETTER_ACKNOWLEDGED = new State(StatesIDs.MIGRATION_T45_LETTER_ACKNOWLEDGED, 'Migration T-45 letter acknowledged', [StateFlags.HAPPY_PATH]);
  static readonly MIGRATION_T45_STAGE_COMPLETE      = new State(StatesIDs.MIGRATION_T45_STAGE_COMPLETE,      'Migration T-45 stage complete',      [StateFlags.HAPPY_PATH]);

  static readonly CONNECTION_INFO_REQUESTED         = new State(StatesIDs.CONNECTION_INFO_REQUESTED,         'Connection info requested',          [StateFlags.HAPPY_PATH, StateFlags.AWAITING_REPLY]);
  static readonly CONNECTION_INFO_RECEIVED          = new State(StatesIDs.CONNECTION_INFO_RECEIVED,          'Connection info received',           [StateFlags.HAPPY_PATH]);
  static readonly CONNECTION_TEST_DATE_PROPOSED     = new State(StatesIDs.CONNECTION_TEST_DATE_PROPOSED,     'Connection test date proposed',      [StateFlags.HAPPY_PATH, StateFlags.AWAITING_REPLY]);
  static readonly CONNECTION_TEST_DATE_CONFIRMED    = new State(StatesIDs.CONNECTION_TEST_DATE_CONFIRMED,    'Connection test date confirmed',     [StateFlags.HAPPY_PATH]);
  static readonly CONNECTION_TEST_OK                = new State(StatesIDs.CONNECTION_TEST_OK,                'Connection test ok',                 [StateFlags.HAPPY_PATH]);
  static readonly CONNECTION_STAGE_COMPLETE         = new State(StatesIDs.CONNECTION_STAGE_COMPLETE,         'Connection stage complete',          [StateFlags.HAPPY_PATH]);

  static readonly MIGRATION_T15_LETTER_SENT         = new State(StatesIDs.MIGRATION_T15_LETTER_SENT,         'Migration T-15 letter sent',         [StateFlags.HAPPY_PATH, StateFlags.AWAITING_REPLY]);
  static readonly MIGRATION_T15_LETTER_ACKNOWLEDGED = new State(StatesIDs.MIGRATION_T15_LETTER_ACKNOWLEDGED, 'Migration T-15 letter acknowledged', [StateFlags.HAPPY_PATH]);
  static readonly MIGRATION_T15_STAGE_COMPLETE      = new State(StatesIDs.MIGRATION_T15_STAGE_COMPLETE,      'Migration T-15 stage complete',      [StateFlags.HAPPY_PATH]);
  static readonly MIGRATION_T5_LETTER_SENT          = new State(StatesIDs.MIGRATION_T5_LETTER_SENT,          'Migration T-5 letter sent',          [StateFlags.HAPPY_PATH, StateFlags.AWAITING_REPLY]);
  static readonly MIGRATION_T5_LETTER_ACKNOWLEDGED  = new State(StatesIDs.MIGRATION_T5_LETTER_ACKNOWLEDGED,  'Migration T-5 letter acknowledged',  [StateFlags.HAPPY_PATH]);
  static readonly MIGRATION_T5_STAGE_COMPLETE       = new State(StatesIDs.MIGRATION_T5_STAGE_COMPLETE,       'Migration T-5 stage complete',       [StateFlags.HAPPY_PATH]);
  static readonly MIGRATION_T1_LETTER_SENT          = new State(StatesIDs.MIGRATION_T1_LETTER_SENT,          'Migration T-1 letter sent',          [StateFlags.HAPPY_PATH, StateFlags.AWAITING_REPLY]);
  static readonly MIGRATION_T1_LETTER_ACKNOWLEDGED  = new State(StatesIDs.MIGRATION_T1_LETTER_ACKNOWLEDGED,  'Migration T-1 letter acknowledged',  [StateFlags.HAPPY_PATH]);
  static readonly MIGRATION_T1_STAGE_COMPLETE       = new State(StatesIDs.MIGRATION_T1_STAGE_COMPLETE,       'Migration T-1 stage complete',       [StateFlags.HAPPY_PATH]);
  static readonly GOLIVE                            = new State(StatesIDs.GOLIVE,                            'GoLive',                             [StateFlags.HAPPY_PATH]);
  static readonly GOLIVE_LETTER_SENT                = new State(StatesIDs.GOLIVE_LETTER_SENT,                'Golive letter sent',                 [StateFlags.AWAITING_REPLY]);
  static readonly RELEASE_COMPLETE                  = new State(StatesIDs.RELEASE_COMPLETE,                  'Release complete',                   [StateFlags.HAPPY_PATH, StateFlags.ENDING_STATE]);

  static readonly EJECTED                           = new State(StatesIDs.EJECTED,                           'Ejected',                            [StateFlags.ERROR_STATE]);
  static readonly CONNECTION_TEST_FAILED            = new State(StatesIDs.CONNECTION_TEST_FAILED,            'Connection test failed',             [StateFlags.ERROR_STATE]);
  static readonly MIGRATION_POSTPONED               = new State(StatesIDs.MIGRATION_POSTPONED,               'Migration postponed',                [StateFlags.ERROR_STATE]);
  static readonly CONNECTION_RETEST_DUE             = new State(StatesIDs.CONNECTION_TEST_FAILED,            'Connection retest due',              [StateFlags.ERROR_STATE]);
}
