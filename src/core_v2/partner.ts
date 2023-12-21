import { immerable, produce } from 'immer';
import { CProcess } from './process';
import _ from 'lodash';
import { CState } from './states';

export class CPartner {
  [immerable] = true;
  readonly id: string;
  readonly name: string;
  readonly processes: CProcess[];
  readonly checked: boolean;
  constructor(id: string, name: string, checked: boolean, processes: CProcess[]) {
    this.id = id;
    this.name = name;
    this.checked = checked;
    this.processes = processes;
  }
  toString(): string {
    return `${this.id}`
  }
  hasAnyProcess(partnerProcess: CProcess[]): boolean {
    return !!this.processes.find(process => !partnerProcess.find(p => p.id === process.id));
  }
  hasProcess(partnerProcess: CProcess): boolean {
    return !!this.processes.find(process => process.id === partnerProcess.id);
  }
  getEjectedProcesses(): CProcess[] {
    return this.processes.filter(process => process.state.id === CState.EJECTED.id);
  }
  getStates(): CState[] {
    const states = this.processes.map(process => process.state);
    const uniqueStates = _.uniq(states);
    return uniqueStates;
  }
  setState(state: CState): CPartner {
    return produce(this, draft => {
      draft.processes = draft.processes.map(process => process.setState(state));
    });
  }
  setChecked(checked: boolean): CPartner {
    return produce(this, draft => {
      draft.checked = checked;
    });
  }
  setProcessState(partnerProcess: CProcess, state: CState): CPartner {
    return produce(this, draft => {
      draft.processes = draft.processes.map(process => {
        if (process.id !== partnerProcess.id) return process;
        return process.setState(state);
      });
    });
  }
  purgeEjectedProcesses(): CPartner {
    return produce(this, draft => {
      draft.processes = draft.processes.filter(process => process.state.id !== CState.EJECTED.id);
    });
  }
}
