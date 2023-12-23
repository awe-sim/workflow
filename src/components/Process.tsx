import { Chip, TableCell, TableRow } from '@mui/material';
import { Process } from '../core/process';
import { StateFlags } from '../core/states';

type Props = {
  process: Process;
};

export const ProcessComponent: React.FC<Props> = ({ process }) => {
  const tag = (() => {
    if (process.state.flags.includes(StateFlags.ERROR_STATE))
      return (
        <Chip
          size="small"
          variant="outlined"
          color="error"
          label={process.state.label}
        />
      );
    if (process.state.flags.includes(StateFlags.AWAITING_REPLY))
      return (
        <Chip
          size="small"
          variant="outlined"
          color="warning"
          label={process.state.label}
        />
      );
    if (process.state.flags.includes(StateFlags.HAPPY_PATH))
      return (
        <Chip
          size="small"
          variant="outlined"
          color="primary"
          label={process.state.label}
        />
      );
    return (
      <Chip
        size="small"
        variant="outlined"
        color="default"
        label={process.state.label}
      />
    );
  })();
  return (
    <TableRow>
      <TableCell />
      <TableCell>{process.id}</TableCell>
      <TableCell>{process.name}</TableCell>
      {/* <TableCell>{process.state.label}</TableCell> */}
      <TableCell>{tag}</TableCell>
      {/* <TableCell><Chip label={process.state.label} variant={process.state.awaitingReply ? 'filled' : 'outlined'} color={process.state.alongMainPath ? 'primary' : 'default'} /></TableCell> */}
    </TableRow>
  );
};
