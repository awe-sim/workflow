import _ from 'lodash';
import { Partner } from './Partner';
import { useCallback, useState } from 'react';
import { TableContainer, Paper, Table, TableBody, Button, Menu, MenuItem } from '@mui/material';
import { CRelease, RELEASE } from '../core_v2/release';
import { WORKFLOW } from '../core_v2/workflow';
import { CAction } from '../core_v2/actions';
import { KeyboardArrowDown } from '@mui/icons-material';

type Props = {};

export const Release: React.FC<Props> = () => {
  const [release, setRelease] = useState(RELEASE);
  const [releaseStack, setReleaseStack] = useState<CRelease[]>([]);
  const updateRelease = useCallback(
    (newRelease: CRelease) => {
      setRelease(newRelease);
      setReleaseStack(releaseStack.concat(release));
    },
    [release]
  );
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
  const handleClose = (action?: CAction) => {
    setAnchorEl(null);
    if (!action) return;
    updateRelease(WORKFLOW.executeAction(release, action, release.getCheckedPartners()));
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
          <TableBody>
            {Object.entries(release.partners).map(([partnerId, partner]) => (
              <Partner
                key={partnerId}
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
          'aria-labelledby': 'basic-button'
        }}>
        {WORKFLOW.getBulkActions(release).map(action => (
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
