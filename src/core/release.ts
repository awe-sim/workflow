import { immerable, produce } from 'immer';
import { Partner } from './partner';
import { State } from './states';
import { Process } from './process';
import _ from 'lodash';

export class Release {
  [immerable] = true;
  readonly name: string;
  readonly partners: Partner[];
  constructor(name: string, partners: Partner[]) {
    this.name = name;
    this.partners = partners;
  }
  getEjectedPartners(): Partner[] {
    return this.partners.filter(partner => partner.getEjectedProcesses().length === partner.processes.length);
  }
  getPartiallyEjectedPartners(): Partner[] {
    return this.partners.filter(partner => partner.getEjectedProcesses().length !== 0);
  }
  getCheckedPartners(): Partner[] {
    return this.partners.filter(partner => partner.checked !== false);
  }
  getCheckedProcesses(): Process[] {
    return _.flatten(this.getCheckedPartners().map(partner => partner.processes));
  }
  getProcesses(partners?: Partner[]): Process[] {
    return _.flatten((partners ?? this.partners).map(partner => partner.processes));
  }
  setPartnerState(releasePartner: Partner, state: State): Release {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        if (partner.id !== releasePartner.id) return partner;
        return partner.setState(state);
      });
    });
  }
  setAllPartnerState(state: State): Release {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        return partner.setState(state);
      });
    });
  }
  setAllPartnersChecked(checked: boolean): Release {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        return partner.setChecked(checked);
      });
    });
  }
  setPartnerChecked(releasePartner: Partner, checked: boolean): Release {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        if (partner.id !== releasePartner.id) return partner;
        return partner.setChecked(checked);
      });
    });
  }
  setProcessState(partnerProcess: Process, state: State): Release {
    if (partnerProcess.state.id === state.id) return this;
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        if (!partner.hasProcess(partnerProcess)) return partner;
        return partner.setProcessState(partnerProcess, state);
      });
    });
  }
  purgeEjectedProcesses(): Release {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => partner.purgeEjectedProcesses()).filter(partner => partner.processes.length !== 0);
    });
  }
  findPartnersForProcesses(processes: Process[]): Partner[] {
    return _.uniq(
      processes
        .map(process => process.findPartner(this))
        .filter(partner => !!partner)
        .map(partner => partner!),
    );
  }
}

export const RELEASE = new Release('Release', [
  new Partner('ASIM', 'Asim', true, [
    new Process('ASIM_1', '850 EDI', State.START), //
    new Process('ASIM_2', '890 EDI', State.START),
    new Process('ASIM_3', '895 EDI', State.START),
  ]),
  new Partner('AAMIR', 'Aamir', true, [
    new Process('AAMIR_1', '850 EDI', State.START), //
    new Process('AAMIR_2', '865 EDI', State.START),
    new Process('AAMIR_3', '890 EDI', State.START),
    new Process('AAMIR_4', '895 EDI', State.START),
  ]),
  new Partner('HASSAN', 'Hassan', true, [
    new Process('HASSAN_1', '895 EDI', State.START), //
  ]),
  new Partner('AHMED', 'Ahmed', true, [
    new Process('AHMED_1', '850 EDI', State.START), //
    new Process('AHMED_2', '890 EDI', State.START),
  ]),
]);
