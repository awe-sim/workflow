import { immerable, produce } from 'immer';
import { CState } from './states';
import { CRelease } from './release';
import { CPartner } from './partner';

export class CProcess {
  [immerable] = true;
  readonly id: string;
  readonly name: string;
  readonly state: CState;
  constructor(id: string, name: string, state: CState) {
    this.id = id;
    this.name = name;
    this.state = state;
  }
  toString(): string {
    return `${this.id}`
  }
  setState(state: CState): CProcess {
    return produce(this, draft => {
      draft.state = state;
    });
  }
  findPartner(release: CRelease): CPartner | undefined {
    return release.partners.find(partner => partner.hasProcess(this));
  }
}
