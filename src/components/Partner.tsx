import { TableRow, TableCell, Checkbox, Button, MenuItem, Menu } from '@mui/material';
import _ from 'lodash';
import { ProcessComponent } from './Process';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import { Workflow } from '../core/workflow';
import { Release } from '../core/release';
import { Partner } from '../core/partner';
import { Action, ActionFlags } from '../core/actions';
import { showMessageBox } from './MessageBox';

type Props = {
  workflow: Workflow;
  release: Release;
  partner: Partner;
  setRelease: (release: Release) => void;
};

export const PartnerComponent: React.FC<Props> = ({ workflow, release, partner, setRelease }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = async (action?: Action) => {
    setAnchorEl(null);
    if (!action) return;
    if (action.flags.includes(ActionFlags.RELEASE_ACTION)) {
      const result = await showMessageBox({
        title: action.label,
        message: 'This is a RELEASE action and is applicable to all processes!',
        buttons: [
          { text: 'OK', value: true, props: { variant: 'outlined' } },
          { text: 'Cancel', value: false, props: { variant: 'contained' } },
        ],
      });
      if (!result) return;
      setRelease(workflow.executeAction(release, action, release.partners));
    } else {
      setRelease(workflow.executeAction(release, action, [partner]));
    }    
  }
  return (
    <>
      <TableRow>
        <TableCell>
          <Checkbox
            checked={partner.checked}
            onChange={(_ev, checked) => setRelease(release.setPartnerChecked(partner, checked))}
          />
        </TableCell>
        <TableCell>
          <b>{partner.id}</b>
        </TableCell>
        <TableCell>
          <b>{partner.name}</b>
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            size="small"
            endIcon={<KeyboardArrowDown />}
            onClick={handleClick}>
            {partner
              .getStates()
              .map(state => state.label)
              .join(', ')}
          </Button>
        </TableCell>
      </TableRow>
      {Object.entries(partner.processes).map(([processId, process]) => (
        <ProcessComponent
          key={processId}
          process={process}
        />
      ))}
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        {workflow.getActionsForStates(partner.getStates()).map(action => (
          <MenuItem
            key={action.id}
            onClick={() => handleClose(action)}>
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
