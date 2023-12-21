import { CAction, ActionEmailAudienceEnum } from './actions';
import { CState } from './states';
import { CRelease } from './release';
import _ from 'lodash';
import { CProcess } from './process';
import { CPartner } from './partner';

export class CWorkflow {
  readonly definition: Map<CState, Map<CAction, CState>>;
  readonly visibility: Map<CState, Set<CAction>>;
  constructor(definition: Map<CState, Map<CAction, CState>>, visibility: Map<CState, Set<CAction>>) {
    this.definition = definition;
    this.visibility = visibility;
  }
  getNextState(state: CState, action: CAction): CState | null {
    return this.definition.get(state)?.get(action) ?? null;
  }
  getActionsForStates(states: CState[]): CAction[] {
    const actionsNested = states.map(state => Array.from(this.definition.get(state)?.keys() ?? []));
    const actions = _.uniq(_.flatten(actionsNested));
    return actions;
  }
  getBulkActions(release: CRelease): CAction[] {
    const processes = release.getCheckedProcesses();
    const states = processes.map(process => process.state);
    return this.getActionsForStates(states);
  }
  makeNextStatesLookup(processes: CProcess[], action: CAction): Map<CProcess, CState | null> {
    return new Map(processes.map(process => [process, this.getNextState(process.state, action)]));
  }
  executeAction(release: CRelease, action: CAction, audiencePartners: CPartner[]): CRelease {
    if (action.flags.isReleaseAction && audiencePartners.length < release.partners.length) {
      audiencePartners = release.partners;
    }
    const audienceProcesses = release.getProcesses(audiencePartners);
    console.group(`Executing [${action.label}]...`);
    try {
      if (action.flags.blockForStates?.length) {
        if (audienceProcesses.some(process => action.flags.blockForStates?.includes(process.state))) {
          throw `No process should be in [${action.flags.blockForStates.join(', ')}] states!`;
        }
      }
      const nextStatesLookup = this.makeNextStatesLookup(audienceProcesses, action);
      const validProcesses = audienceProcesses.filter(process => !!nextStatesLookup.get(process));
      console.groupCollapsed('State transitions');
      validProcesses.forEach(process => {
        const nextState = nextStatesLookup.get(process)!;
        if (process.state.id !== nextState.id) {
          console.log(`${process}: ${process.state} → ${action} → ${nextState}`);
          release = release.setProcessState(process, nextState);
        }
      });
      console.groupEnd();
      const ejectedProcesses = release.getProcesses().filter(process => process.state.id === CState.EJECTED.id);
      const validPartners = release.findPartnersForProcesses(validProcesses);
      const ejectedPartners = release.findPartnersForProcesses(ejectedProcesses);
      if (action.flags.emailAudience?.includes(ActionEmailAudienceEnum.NON_EJECTED_PARTNERS)) {
        validPartners.forEach(partner => {
          console.log(`${partner}: Send email`);
        });
      }
      if (action.flags.emailAudience?.includes(ActionEmailAudienceEnum.EJECTED_PARTNERS)) {
        ejectedPartners.forEach(partner => {
          console.log(`${partner}: Send ejection email`);
        });
      }
      if (action.flags.emailAudience?.includes(ActionEmailAudienceEnum.CUSTOMER)) {
        console.log(`Customer: Send email`);
      }
      release = release.purgeEjectedProcesses();
      return release;
    } catch (ex) {
      console.warn(ex);
      return release;
    } finally {
      console.groupEnd();
    }
  }
}

export const WORKFLOW = new CWorkflow(
  new Map<CState, Map<CAction, CState>>([
    [CState.START, new Map([[CAction.SEND_MIGRATION_T45_LETTER, CState.MIGRATION_T45_LETTER_SENT]])],
    [
      CState.MIGRATION_T45_LETTER_SENT,
      new Map([
        [CAction.ACKNOWLEDGE_MIGRATION_LETTER, CState.MIGRATION_T45_LETTER_ACKNOWLEDGED],
        [CAction.SEND_REMINDER, CState.MIGRATION_T45_LETTER_SENT],
        [CAction.FINALIZE_MIGRATION_T45_STAGE, CState.EJECTED]
      ])
    ],
    [CState.MIGRATION_T45_LETTER_ACKNOWLEDGED, new Map([[CAction.FINALIZE_MIGRATION_T45_STAGE, CState.MIGRATION_T45_STAGE_COMPLETE]])],
    [CState.MIGRATION_T45_STAGE_COMPLETE, new Map([[CAction.REQUEST_CONNECTION_INFO, CState.CONNECTION_INFO_REQUESTED]])],
    [
      CState.CONNECTION_INFO_REQUESTED,
      new Map([
        [CAction.RECEIVE_CONNECTION_INFO, CState.CONNECTION_INFO_RECEIVED],
        [CAction.SEND_REMINDER, CState.CONNECTION_INFO_REQUESTED],
        [CAction.FINALIZE_CONNECTION_STAGE, CState.EJECTED]
      ])
    ],
    [
      CState.CONNECTION_INFO_RECEIVED,
      new Map([
        [CAction.PROPOSE_CONNECTION_TEST_DATE, CState.CONNECTION_TEST_DATE_PROPOSED],
        [CAction.CONNECTION_TEST_OK, CState.CONNECTION_TEST_OK],
        [CAction.FINALIZE_CONNECTION_STAGE, CState.EJECTED]
      ])
    ],
    [
      CState.CONNECTION_TEST_DATE_PROPOSED,
      new Map([
        [CAction.CONFIRM_CONNECTION_TEST_DATE, CState.CONNECTION_TEST_DATE_CONFIRMED],
        [CAction.SEND_REMINDER, CState.CONNECTION_TEST_DATE_PROPOSED],
        [CAction.FINALIZE_CONNECTION_STAGE, CState.EJECTED]
      ])
    ],
    [
      CState.CONNECTION_TEST_DATE_CONFIRMED,
      new Map([
        [CAction.CONNECTION_TEST_OK, CState.CONNECTION_TEST_OK],
        [CAction.CONNECTION_TEST_FAILED, CState.CONNECTION_TEST_FAILED],
        [CAction.FINALIZE_CONNECTION_STAGE, CState.EJECTED]
      ])
    ],
    [
      CState.CONNECTION_TEST_OK,
      new Map([
        [CAction.REQUEST_CONNECTION_INFO, CState.CONNECTION_INFO_REQUESTED],
        [CAction.FINALIZE_CONNECTION_STAGE, CState.CONNECTION_STAGE_COMPLETE]
      ])
    ],
    [
      CState.CONNECTION_TEST_FAILED,
      new Map([
        [CAction.CONNECTION_TEST_OK, CState.CONNECTION_TEST_OK],
        [CAction.PROPOSE_CONNECTION_TEST_DATE, CState.CONNECTION_TEST_DATE_PROPOSED],
        [CAction.FINALIZE_CONNECTION_STAGE, CState.EJECTED]
      ])
    ],
    [CState.CONNECTION_STAGE_COMPLETE, new Map([[CAction.SEND_MIGRATION_T15_LETTER, CState.MIGRATION_T15_LETTER_SENT]])],
    [
      CState.MIGRATION_T15_LETTER_SENT,
      new Map([
        [CAction.ACKNOWLEDGE_MIGRATION_LETTER, CState.MIGRATION_T15_LETTER_ACKNOWLEDGED],
        [CAction.SEND_REMINDER, CState.MIGRATION_T15_LETTER_SENT],
        [CAction.POSTPONE_MIGRATION, CState.MIGRATION_POSTPONED],
        [CAction.FINALIZE_MIGRATION_T15_STAGE, CState.EJECTED]
      ])
    ],
    [
      CState.MIGRATION_T15_LETTER_ACKNOWLEDGED,
      new Map([
        [CAction.FINALIZE_MIGRATION_T15_STAGE, CState.MIGRATION_T15_STAGE_COMPLETE],
        [CAction.POSTPONE_MIGRATION, CState.MIGRATION_POSTPONED]
      ])
    ],
    [CState.MIGRATION_T15_STAGE_COMPLETE, new Map([[CAction.SEND_MIGRATION_T5_LETTER, CState.MIGRATION_T5_LETTER_SENT]])],
    [
      CState.MIGRATION_T5_LETTER_SENT,
      new Map([
        [CAction.ACKNOWLEDGE_MIGRATION_LETTER, CState.MIGRATION_T5_LETTER_ACKNOWLEDGED],
        [CAction.SEND_REMINDER, CState.MIGRATION_T5_LETTER_SENT],
        [CAction.POSTPONE_MIGRATION, CState.MIGRATION_POSTPONED],
        [CAction.FINALIZE_MIGRATION_T5_STAGE, CState.EJECTED]
      ])
    ],
    [
      CState.MIGRATION_T5_LETTER_ACKNOWLEDGED,
      new Map([
        [CAction.POSTPONE_MIGRATION, CState.MIGRATION_POSTPONED],
        [CAction.FINALIZE_MIGRATION_T5_STAGE, CState.MIGRATION_T5_STAGE_COMPLETE]
      ])
    ],
    [CState.MIGRATION_T5_STAGE_COMPLETE, new Map([[CAction.SEND_MIGRATION_T1_LETTER, CState.MIGRATION_T1_LETTER_SENT]])],
    [
      CState.MIGRATION_T1_LETTER_SENT,
      new Map([
        [CAction.ACKNOWLEDGE_MIGRATION_LETTER, CState.MIGRATION_T1_LETTER_ACKNOWLEDGED],
        [CAction.FINALIZE_MIGRATION_T1_STAGE, CState.EJECTED],
        [CAction.SEND_REMINDER, CState.MIGRATION_T1_LETTER_SENT],
        [CAction.POSTPONE_MIGRATION, CState.MIGRATION_POSTPONED]
      ])
    ],
    [
      CState.MIGRATION_T1_LETTER_ACKNOWLEDGED,
      new Map([
        [CAction.POSTPONE_MIGRATION, CState.MIGRATION_POSTPONED],
        [CAction.FINALIZE_MIGRATION_T1_STAGE, CState.MIGRATION_T1_STAGE_COMPLETE]
      ])
    ],
    [CState.MIGRATION_T1_STAGE_COMPLETE, new Map([[CAction.GOLIVE, CState.GOLIVE]])],
    [CState.MIGRATION_POSTPONED, new Map([[CAction.RESUME_MIGRATION, CState.CONNECTION_RETEST_DUE]])],
    [
      CState.CONNECTION_RETEST_DUE,
      new Map([
        [CAction.CONNECTION_TEST_OK, CState.CONNECTION_STAGE_COMPLETE],
        [CAction.CONNECTION_TEST_FAILED, CState.MIGRATION_T45_STAGE_COMPLETE]
      ])
    ],
    [
      CState.GOLIVE,
      new Map([
        [CAction.SEND_GOLIVE_LETTER, CState.GOLIVE_LETTER_SENT],
        [CAction.FINALIZE_RELEASE, CState.RELEASE_COMPLETE]
      ])
    ],
    [CState.GOLIVE_LETTER_SENT, new Map([[CAction.FINALIZE_RELEASE, CState.RELEASE_COMPLETE]])]
  ]),
  new Map<CState, Set<CAction>>([
    [CState.START, new Set([CAction.SEND_MIGRATION_T45_LETTER])],
    [CState.MIGRATION_T45_LETTER_SENT, new Set([CAction.ACKNOWLEDGE_MIGRATION_LETTER, CAction.SEND_REMINDER, CAction.FINALIZE_MIGRATION_T45_STAGE])],
    [CState.MIGRATION_T45_LETTER_ACKNOWLEDGED, new Set([CAction.FINALIZE_MIGRATION_T45_STAGE])],
    [CState.MIGRATION_T45_STAGE_COMPLETE, new Set([CAction.REQUEST_CONNECTION_INFO])],
    [CState.CONNECTION_INFO_REQUESTED, new Set([CAction.RECEIVE_CONNECTION_INFO, CAction.SEND_REMINDER, CAction.FINALIZE_CONNECTION_STAGE])],
    [CState.CONNECTION_INFO_RECEIVED, new Set([CAction.PROPOSE_CONNECTION_TEST_DATE, CAction.CONNECTION_TEST_OK, CAction.FINALIZE_CONNECTION_STAGE])],
    [CState.CONNECTION_TEST_DATE_PROPOSED, new Set([CAction.CONFIRM_CONNECTION_TEST_DATE, CAction.SEND_REMINDER, CAction.FINALIZE_CONNECTION_STAGE])],
    [CState.CONNECTION_TEST_DATE_CONFIRMED, new Set([CAction.CONNECTION_TEST_OK, CAction.CONNECTION_TEST_FAILED, CAction.FINALIZE_CONNECTION_STAGE])],
    [CState.CONNECTION_TEST_OK, new Set([CAction.REQUEST_CONNECTION_INFO, CAction.FINALIZE_CONNECTION_STAGE])],
    [CState.CONNECTION_TEST_FAILED, new Set([CAction.CONNECTION_TEST_OK, CAction.PROPOSE_CONNECTION_TEST_DATE, CAction.FINALIZE_CONNECTION_STAGE])],
    [CState.CONNECTION_STAGE_COMPLETE, new Set([CAction.SEND_MIGRATION_T15_LETTER])],
    [CState.MIGRATION_T15_LETTER_SENT, new Set([CAction.ACKNOWLEDGE_MIGRATION_LETTER, CAction.SEND_REMINDER, CAction.POSTPONE_MIGRATION])],
    [CState.MIGRATION_T15_LETTER_ACKNOWLEDGED, new Set([CAction.FINALIZE_MIGRATION_T15_STAGE, CAction.POSTPONE_MIGRATION])],
    [CState.MIGRATION_T5_LETTER_SENT, new Set([CAction.ACKNOWLEDGE_MIGRATION_LETTER, CAction.SEND_REMINDER, CAction.POSTPONE_MIGRATION, CAction.FINALIZE_MIGRATION_T5_STAGE])],
    [CState.MIGRATION_T5_LETTER_ACKNOWLEDGED, new Set([CAction.POSTPONE_MIGRATION, CAction.FINALIZE_MIGRATION_T5_STAGE])],
    [CState.MIGRATION_T1_LETTER_SENT, new Set([CAction.ACKNOWLEDGE_MIGRATION_LETTER, CAction.SEND_REMINDER, CAction.POSTPONE_MIGRATION])],
    [CState.MIGRATION_T1_LETTER_ACKNOWLEDGED, new Set([CAction.POSTPONE_MIGRATION, CAction.FINALIZE_MIGRATION_T1_STAGE])],
    [CState.MIGRATION_POSTPONED, new Set([CAction.RESUME_MIGRATION])],
    [CState.CONNECTION_RETEST_DUE, new Set([CAction.CONNECTION_TEST_OK, CAction.CONNECTION_TEST_FAILED])],
    [CState.MIGRATION_T1_STAGE_COMPLETE, new Set([CAction.GOLIVE])],
    [CState.GOLIVE, new Set([CAction.SEND_GOLIVE_LETTER, CAction.FINALIZE_RELEASE])],
    [CState.GOLIVE_LETTER_SENT, new Set([CAction.FINALIZE_RELEASE])]
  ])
);
