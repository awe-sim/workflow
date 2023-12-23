import { immerable, produce } from 'immer';
import { State } from './states';
import { Release } from './release';
import { Partner } from './partner';

export class Process {
  [immerable] = true;
  readonly id: string;
  readonly name: string;
  readonly state: State;
  constructor(id: string, name: string, state: State) {
    this.id = id;
    this.name = name;
    this.state = state;
  }
  toString(): string {
    return `${this.id}`
  }
  setState(state: State): Process {
    return produce(this, draft => {
      draft.state = state;
    });
  }
  findPartner(release: Release): Partner | undefined {
    return release.partners.find(partner => partner.hasProcess(this));
  }
}
