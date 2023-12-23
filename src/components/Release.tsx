import _ from 'lodash';
import { PartnerComponent } from './Partner';
import { useCallback, useState } from 'react';
import { TableContainer, Paper, Table, TableBody, Button, Menu, MenuItem, TableHead, TableCell, Checkbox } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import { RELEASE, Release } from '../core/release';
import { Action, ActionFlags } from '../core/actions';
import { WORKFLOW } from '../core/workflow';
import { showMessageBox } from './MessageBox';

type Props = {};

export const ReleaseComponent: React.FC<Props> = () => {
  const [release, setRelease] = useState(RELEASE);
  const [releaseStack, setReleaseStack] = useState<Release[]>([]);
  const updateRelease = useCallback(
    (newRelease: Release) => {
      setRelease(newRelease);
      setReleaseStack(releaseStack.concat(release));
    },
    [release],
  );
  const checked = release.getCheckedPartners().length === release.partners.length;
  const indeterminate = release.getCheckedPartners().length !== 0 && release.getCheckedPartners().length !== release.partners.length;
  const onChecked = (value: boolean) => {
    updateRelease(release.setAllPartnersChecked(value));
  };
  const undo = useCallback(() => {
    const oldReleaseStack = [...releaseStack];
    const oldRelease = oldReleaseStack.pop();
    if (!oldRelease) return;
    setRelease(oldRelease);
    setReleaseStack(oldReleaseStack);
  }, [releaseStack]);

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
      updateRelease(WORKFLOW.executeAction(release, action, release.partners));
    } else {
      updateRelease(WORKFLOW.executeAction(release, action, release.getCheckedPartners()));
    }
  };
  return (
    <>
      <Button
        variant="contained"
        size="small"
        endIcon={<KeyboardArrowDown />}
        onClick={handleClick}>
        Bulk Actions
      </Button>
      &nbsp;
      <Button
        variant="outlined"
        size="small"
        disabled={releaseStack.length === 0}
        onClick={undo}>
        Undo
      </Button>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="simple table">
          <TableHead>
            <TableCell width={10}>
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={(_ev, checked) => onChecked(checked)}
              />
            </TableCell>
            <TableCell width={100}>Name</TableCell>
            <TableCell width={100}>Code</TableCell>
            <TableCell>Actions</TableCell>
          </TableHead>
          <TableBody>
            {release.partners.map(partner => (
              <PartnerComponent
                key={partner.id}
                workflow={WORKFLOW}
                release={release}
                partner={partner}
                setRelease={updateRelease}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        {WORKFLOW.getBulkActions(release, release.getCheckedPartners()).map(action => (
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
