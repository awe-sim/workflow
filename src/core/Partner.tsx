import { TableRow, TableCell, Checkbox, Button, MenuItem, Menu } from '@mui/material';
import _ from 'lodash';
import { Process } from './Process';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import { CRelease } from '../core_v2/release';
import { CPartner } from '../core_v2/partner';
import { CWorkflow } from '../core_v2/workflow';
import { CAction } from '../core_v2/actions';

type Props = {
  workflow: CWorkflow;
  release: CRelease;
  partner: CPartner;
  setRelease: (release: CRelease) => void;
};

export const Partner: React.FC<Props> = ({ workflow, release, partner, setRelease }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (action?: CAction) => {
    setAnchorEl(null);
    if (!action) return;
    setRelease(workflow.executeAction(release, action, [partner]));
  };
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
            size='small'
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
        <Process
          key={processId}
          process={process}
        />
      ))}
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}>
        {workflow
          .getActionsForStates(partner.getStates())
          .map(action => (
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
