import { Chip, TableCell, TableRow } from '@mui/material';
import { CProcess } from '../core_v2/process';

type Props = {
  process: CProcess;
};

export const Process: React.FC<Props> = ({ process }) => {
  const tag = (() => {
    if (process.state.errorState)
      return (
        <Chip
          size='small'
          variant='outlined'
          color="error"
          label={process.state.label}
        />
      );
    if (process.state.awaitingReply)
      return (
        <Chip
          size='small'
          variant='outlined'
          color="warning"
          label={process.state.label}
        />
      );
    if (process.state.alongMainPath)
      return (
        <Chip
          size='small'
          variant="outlined"
          color="primary"
          label={process.state.label}
        />
      );
    return (
      <Chip
        size='small'
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
