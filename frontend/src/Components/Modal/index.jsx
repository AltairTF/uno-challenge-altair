import { Button, Modal, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  minWidth: '300px',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};

function ModalEditarItem({ open, handleClose, header, style, selectedItem, onSave }) {
  const [itemModal, setItemModal] = useState(selectedItem);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, ...styleModal }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {header}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <TextField
              id="itemEditar"
              label="Digite aqui"
              value={itemModal?.name}
              type="text"
              variant="standard"
              onChange={e => setItemModal({ ...itemModal, name: e?.target?.value })}
            />
            <Button variant="contained" sx={{ width: '100%' }} color="success" onClick={() => onSave(itemModal)}>
              Salvar
            </Button>
          </div>
        </Typography>
      </Box>
    </Modal>
  );
}

export default ModalEditarItem;
