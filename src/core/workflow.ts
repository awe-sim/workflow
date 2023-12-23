import { Action, ActionFlags } from './actions';
import { State } from './states';
import { Release } from './release';
import _ from 'lodash';
import { Process } from './process';
import { Partner } from './partner';

export type NextStateDetails = {
  state: State;
  isHidden?: boolean;
};

export class Workflow {
  readonly definition: Map<State, Map<Action, NextStateDetails>>;
  constructor(definition: Map<State, Map<Action, NextStateDetails>>) {
    this.definition = definition;
  }
  getNextStateDetails(state: State, action: Action): NextStateDetails | undefined {
    return this.definition.get(state)?.get(action);
  }
  getActionsForStates(states: State[]): Action[] {
    const actionsNested = states.map(state =>
      Array.from(this.definition.get(state)?.entries() ?? [])
        .filter(([_, { isHidden }]) => !isHidden)
        .map(([action]) => action),
    );
    const actions = _.uniq(_.flatten(actionsNested));
    return actions;
  }
  getBulkActions(release: Release, partners: Partner[]): Action[] {
    const processes = release.getProcesses(partners);
    const states = _.uniq(processes.map(process => process.state));
    return this.getActionsForStates(states);
  }
  makeNextStateDetailsLookup(processes: Process[], action: Action): Map<Process, NextStateDetails | undefined> {
    return new Map(processes.map(process => [process, this.getNextStateDetails(process.state, action)]));
  }
  executeAction(release: Release, action: Action, audiencePartners: Partner[]): Release {
    if (action.flags.includes(ActionFlags.RELEASE_ACTION) && audiencePartners.length < release.partners.length) {
      audiencePartners = release.partners;
    }
    const audienceProcesses = release.getProcesses(audiencePartners);
    console.group(`Executing [${action.label}]...`);
    try {
      const nextStatesLookup = this.makeNextStateDetailsLookup(audienceProcesses, action);
      audienceProcesses.forEach(process => {
        const nextState = nextStatesLookup.get(process)?.state;
        if (nextState) {
          release = release.setProcessState(process, nextState);
        } else {
          release = release.setProcessState(process, State.EJECTED);
        }
      });
      const validProcesses = audienceProcesses.filter(process => !!nextStatesLookup.get(process));
      const ejectedProcesses = release.getProcesses().filter(process => process.state.id === State.EJECTED.id);
      const validPartners = release.findPartnersForProcesses(validProcesses);
      const ejectedPartners = release.findPartnersForProcesses(ejectedProcesses);
      if (action.emailTemplateIds.partners) {
        validPartners.forEach(partner => {
          console.log(`${partner}: Send email: ${action.emailTemplateIds.partners}`);
        });
      }
      if (action.emailTemplateIds.ejectedPartners) {
        ejectedPartners.forEach(partner => {
          console.log(`${partner}: Send email: ${action.emailTemplateIds.ejectedPartners}`);
        });
      }
      if (action.emailTemplateIds.customer) {
        console.log(`Customer: Send email: ${action.emailTemplateIds.customer}`);
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

export const WORKFLOW = new Workflow(
  new Map<State, Map<Action, NextStateDetails>>([
    [State.START, new Map([[Action.SEND_MIGRATION_T45_LETTER, { state: State.MIGRATION_T45_LETTER_SENT }]])],
    [
      State.MIGRATION_T45_LETTER_SENT,
      new Map([
        [Action.ACKNOWLEDGE_MIGRATION_LETTER, { state: State.MIGRATION_T45_LETTER_ACKNOWLEDGED }],
        [Action.SEND_REMINDER, { state: State.MIGRATION_T45_LETTER_SENT }],
      ]),
    ],
    [State.MIGRATION_T45_LETTER_ACKNOWLEDGED, new Map([[Action.FINALIZE_MIGRATION_T45_STAGE, { state: State.MIGRATION_T45_STAGE_COMPLETE }]])],
    [State.MIGRATION_T45_STAGE_COMPLETE, new Map([[Action.REQUEST_CONNECTION_INFO, { state: State.CONNECTION_INFO_REQUESTED }]])],
    [
      State.CONNECTION_INFO_REQUESTED,
      new Map([
        [Action.RECEIVE_CONNECTION_INFO, { state: State.CONNECTION_INFO_RECEIVED }],
        [Action.SEND_REMINDER, { state: State.CONNECTION_INFO_REQUESTED }],
      ]),
    ],
    [
      State.CONNECTION_INFO_RECEIVED,
      new Map([
        [Action.CONNECTION_TEST_OK, { state: State.CONNECTION_TEST_OK }],
        [Action.PROPOSE_CONNECTION_TEST_DATE, { state: State.CONNECTION_TEST_DATE_PROPOSED }],
      ]),
    ],
    [
      State.CONNECTION_TEST_DATE_PROPOSED,
      new Map([
        [Action.CONFIRM_CONNECTION_TEST_DATE, { state: State.CONNECTION_TEST_DATE_CONFIRMED }],
        [Action.SEND_REMINDER, { state: State.CONNECTION_TEST_DATE_PROPOSED }],
      ]),
    ],
    [
      State.CONNECTION_TEST_DATE_CONFIRMED,
      new Map([
        [Action.CONNECTION_TEST_OK, { state: State.CONNECTION_TEST_OK }],
        [Action.CONNECTION_TEST_FAILED, { state: State.CONNECTION_TEST_FAILED }],
      ]),
    ],
    [
      State.CONNECTION_TEST_OK,
      new Map([
        [Action.FINALIZE_CONNECTION_STAGE, { state: State.CONNECTION_STAGE_COMPLETE }],
        [Action.REQUEST_CONNECTION_INFO, { state: State.CONNECTION_INFO_REQUESTED }],
      ]),
    ],
    [
      State.CONNECTION_TEST_FAILED,
      new Map([
        [Action.CONNECTION_TEST_OK, { state: State.CONNECTION_TEST_OK }],
        [Action.PROPOSE_CONNECTION_TEST_DATE, { state: State.CONNECTION_TEST_DATE_PROPOSED }],
      ]),
    ],
    [State.CONNECTION_STAGE_COMPLETE, new Map([[Action.SEND_MIGRATION_T15_LETTER, { state: State.MIGRATION_T15_LETTER_SENT }]])],
    [
      State.MIGRATION_T15_LETTER_SENT,
      new Map([
        [Action.ACKNOWLEDGE_MIGRATION_LETTER, { state: State.MIGRATION_T15_LETTER_ACKNOWLEDGED }],
        [Action.SEND_REMINDER, { state: State.MIGRATION_T15_LETTER_SENT }],
        [Action.POSTPONE_MIGRATION, { state: State.MIGRATION_POSTPONED }],
      ]),
    ],
    [
      State.MIGRATION_T15_LETTER_ACKNOWLEDGED,
      new Map([
        [Action.FINALIZE_MIGRATION_T15_STAGE, { state: State.MIGRATION_T15_STAGE_COMPLETE }],
        [Action.POSTPONE_MIGRATION, { state: State.MIGRATION_POSTPONED }],
      ]),
    ],
    [State.MIGRATION_T15_STAGE_COMPLETE, new Map([[Action.SEND_MIGRATION_T5_LETTER, { state: State.MIGRATION_T5_LETTER_SENT }]])],
    [
      State.MIGRATION_T5_LETTER_SENT,
      new Map([
        [Action.ACKNOWLEDGE_MIGRATION_LETTER, { state: State.MIGRATION_T5_LETTER_ACKNOWLEDGED }],
        [Action.SEND_REMINDER, { state: State.MIGRATION_T5_LETTER_SENT }],
        [Action.POSTPONE_MIGRATION, { state: State.MIGRATION_POSTPONED }],
      ]),
    ],
    [
      State.MIGRATION_T5_LETTER_ACKNOWLEDGED,
      new Map([
        [Action.FINALIZE_MIGRATION_T5_STAGE, { state: State.MIGRATION_T5_STAGE_COMPLETE }],
        [Action.POSTPONE_MIGRATION, { state: State.MIGRATION_POSTPONED }],
      ]),
    ],
    [State.MIGRATION_T5_STAGE_COMPLETE, new Map([[Action.SEND_MIGRATION_T1_LETTER, { state: State.MIGRATION_T1_LETTER_SENT }]])],
    [
      State.MIGRATION_T1_LETTER_SENT,
      new Map([
        [Action.ACKNOWLEDGE_MIGRATION_LETTER, { state: State.MIGRATION_T1_LETTER_ACKNOWLEDGED }],
        [Action.SEND_REMINDER, { state: State.MIGRATION_T1_LETTER_SENT }],
        [Action.POSTPONE_MIGRATION, { state: State.MIGRATION_POSTPONED }],
      ]),
    ],
    [
      State.MIGRATION_T1_LETTER_ACKNOWLEDGED,
      new Map([
        [Action.FINALIZE_MIGRATION_T1_STAGE, { state: State.MIGRATION_T1_STAGE_COMPLETE }],
        [Action.POSTPONE_MIGRATION, { state: State.MIGRATION_POSTPONED }],
      ]),
    ],
    [State.MIGRATION_T1_STAGE_COMPLETE, new Map([[Action.GOLIVE, { state: State.GOLIVE }]])],
    [State.MIGRATION_POSTPONED, new Map([[Action.RESUME_MIGRATION, { state: State.CONNECTION_RETEST_DUE }]])],
    [
      State.CONNECTION_RETEST_DUE,
      new Map([
        [Action.CONNECTION_TEST_OK, { state: State.CONNECTION_STAGE_COMPLETE }],
        [Action.CONNECTION_TEST_FAILED, { state: State.MIGRATION_T45_STAGE_COMPLETE }],
      ]),
    ],
    [
      State.GOLIVE,
      new Map([
        [Action.SEND_GOLIVE_LETTER, { state: State.GOLIVE_LETTER_SENT }],
        [Action.FINALIZE_RELEASE, { state: State.RELEASE_COMPLETE }],
      ]),
    ],
    [State.GOLIVE_LETTER_SENT, new Map([[Action.FINALIZE_RELEASE, { state: State.RELEASE_COMPLETE }]])],
  ]),
);
