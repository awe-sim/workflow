import { immerable, produce } from 'immer';
import { Process } from './process';
import _ from 'lodash';
import { State } from './states';

export class Partner {
  [immerable] = true;
  readonly id: string;
  readonly name: string;
  readonly processes: Process[];
  readonly checked: boolean;
  constructor(id: string, name: string, checked: boolean, processes: Process[]) {
    this.id = id;
    this.name = name;
    this.checked = checked;
    this.processes = processes;
  }
  toString(): string {
    return `${this.id}`
  }
  hasAnyProcess(partnerProcess: Process[]): boolean {
    return !!this.processes.find(process => !partnerProcess.find(p => p.id === process.id));
  }
  hasProcess(partnerProcess: Process): boolean {
    return !!this.processes.find(process => process.id === partnerProcess.id);
  }
  getEjectedProcesses(): Process[] {
    return this.processes.filter(process => process.state.id === State.EJECTED.id);
  }
  getStates(): State[] {
    const states = this.processes.map(process => process.state);
    const uniqueStates = _.uniq(states);
    return uniqueStates;
  }
  setState(state: State): Partner {
    return produce(this, draft => {
      draft.processes = draft.processes.map(process => process.setState(state));
    });
  }
  setChecked(checked: boolean): Partner {
    return produce(this, draft => {
      draft.checked = checked;
    });
  }
  setProcessState(partnerProcess: Process, state: State): Partner {
    return produce(this, draft => {
      draft.processes = draft.processes.map(process => {
        if (process.id !== partnerProcess.id) return process;
        return process.setState(state);
      });
    });
  }
  purgeEjectedProcesses(): Partner {
    return produce(this, draft => {
      draft.processes = draft.processes.filter(process => process.state.id !== State.EJECTED.id);
    });
  }
}
