import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { InstanceProps, createModal } from 'react-modal-promise';

type Props = {
  title: string;
  message: string;
  buttons: {
    text: string;
    value: any;
    props?: ButtonProps;
  }[];
};

const MessageBox: React.FC<InstanceProps<any, any> & Props> = ({ title, message, buttons, isOpen, onResolve }) => {
  return (
    <Dialog open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {buttons.map(({ text, value, props }, index) => (
          <Button
            key={index}
            {...props}
            onClick={() => {
              onResolve(value);
            }}>
            {text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

const MessageBoxModal = createModal(MessageBox);

export function showMessageBox(options: Props): Promise<any> {
  return MessageBoxModal(options);
}
