import { immerable, produce } from 'immer';
import { CPartner } from './partner';
import { CState } from './states';
import { CProcess } from './process';
import _ from 'lodash';

export class CRelease {
  [immerable] = true;
  readonly name: string;
  readonly partners: CPartner[];
  constructor(name: string, partners: CPartner[]) {
    this.name = name;
    this.partners = partners;
  }
  getEjectedPartners(): CPartner[] {
    return this.partners.filter(partner => partner.getEjectedProcesses().length === partner.processes.length);
  }
  getPartiallyEjectedPartners(): CPartner[] {
    return this.partners.filter(partner => partner.getEjectedProcesses().length !== 0);
  }
  getCheckedPartners(): CPartner[] {
    return this.partners.filter(partner => partner.checked !== false);
  }
  getCheckedProcesses(): CProcess[] {
    return _.flatten(this.getCheckedPartners().map(partner => partner.processes));
  }
  getProcesses(partners?: CPartner[]): CProcess[] {
    return _.flatten((partners ?? this.partners).map(partner => partner.processes));
  }
  setPartnerState(releasePartner: CPartner, state: CState): CRelease {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        if (partner.id !== releasePartner.id) return partner;
        return partner.setState(state);
      });
    });
  }
  setAllPartnerState(state: CState): CRelease {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        return partner.setState(state);
      });
    });
  }
  setPartnerChecked(releasePartner: CPartner, checked: boolean): CRelease {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        if (partner.id !== releasePartner.id) return partner;
        return partner.setChecked(checked);
      });
    });
  }
  setProcessState(partnerProcess: CProcess, state: CState): CRelease {
    return produce(this, draft => {
      draft.partners = draft.partners.map(partner => {
        if (!partner.hasProcess(partnerProcess)) return partner;
        return partner.setProcessState(partnerProcess, state);
      });
    });
  }
  purgeEjectedProcesses(): CRelease {
    return produce(this, draft => {
      draft.partners = draft.partners
      .map(partner => partner.purgeEjectedProcesses())
      .filter(partner => partner.processes.length !== 0);
    });
  }
  findPartnersForProcesses(processes: CProcess[]): CPartner[] {
    return _.uniq(processes.map(process => process.findPartner(this)).filter(partner => !!partner).map(partner => partner!));
  }
}

export const RELEASE = new CRelease('Release', [
  new CPartner('ASIM', 'Asim', false, [
    new CProcess('ASIM_1', '850 EDI', CState.START), //
    new CProcess('ASIM_2', '890 EDI', CState.START),
    new CProcess('ASIM_3', '895 EDI', CState.START)
  ]),
  new CPartner('AAMIR', 'Aamir', false, [
    new CProcess('AAMIR_1', '850 EDI', CState.START), //
    new CProcess('AAMIR_2', '865 EDI', CState.START),
    new CProcess('AAMIR_3', '890 EDI', CState.START),
    new CProcess('AAMIR_4', '895 EDI', CState.START)
  ]),
  new CPartner('HASSAN', 'Hassan', false, [
    new CProcess('HASSAN_1', '895 EDI', CState.START) //
  ]),
  new CPartner('AHMED', 'Ahmed', false, [
    new CProcess('AHMED_1', '850 EDI', CState.START), //
    new CProcess('AHMED_2', '890 EDI', CState.START)
  ])
]);
