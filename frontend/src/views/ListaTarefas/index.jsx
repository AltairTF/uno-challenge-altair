import { useMutation, useQuery } from '@apollo/client';
import { getOperationName } from '@apollo/client/utilities';
import { Delete, Edit } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { styled } from 'styled-components';
import { ADD_ITEM_MUTATION, DELETE_ITEM_MUTATION, GET_TODO_LIST, UPDATE_ITEM_MUTATION } from './queries';
import toast, { Toaster } from 'react-hot-toast';
import If from '../../Components/If';
import ModalEditarItem from '../../Components/Modal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContainerTop = styled.form`
  display: flex;
  background-color: #dcdcdc;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  border-radius: 5px;
`;

const ContainerList = styled.div`
  display: flex;
  width: 600px;
  background-color: #dcdcdc;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  gap: 10px;
  border-radius: 5px;
`;
const ContainerListItem = styled.div`
  background-color: #efefef;
  padding: 10px;
  border-radius: 5px;
  max-height: 400px;
  overflow: auto;
`;

const ContainerButton = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 28px;
`;

function ListaTarefas() {
  const [item, setItem] = useState('');
  const [filter, setFilter] = useState('');
  const [modalEditarItemVisible, setModalEditarItemVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data, refetch } = useQuery(GET_TODO_LIST, {
    variables: {
      filter: filter ? { name: filter } : null,
    },
  });

  const [addItem] = useMutation(ADD_ITEM_MUTATION);
  const [updateItem] = useMutation(UPDATE_ITEM_MUTATION);
  const [deleteItem] = useMutation(DELETE_ITEM_MUTATION);

  const onSubmit = async event => {
    if (!item) {
      toast.error('Atenção: o item deve ser informado');
      return;
    }
    event.preventDefault();
    try {
      await addItem({
        variables: {
          values: {
            name: item,
          },
        },
        refetchQueries: [{ query: GET_TODO_LIST, variables: { filter: filter ? { name: filter } : null } }],
        awaitRefetchQueries: true,
      });
      setItem('');
    } catch (error) {
      toast.error('Erro ao adicionar tarefa!', error);
      console.error('Error:', error);
    }
  };

  const onDelete = async itemId => {
    try {
      await deleteItem({
        variables: { id: itemId },
        refetchQueries: [getOperationName(GET_TODO_LIST)],
        awaitRefetchQueries: true,
      });
      toast.success('Tarefa removida!');
    } catch (error) {
      toast.error('Erro ao remover tarefa!');
      console.error('Error:', error);
    }
  };

  const onUpdate = async item => {
    try {
      await updateItem({
        variables: {
          values: {
            id: item.id,
            name: item.name,
          },
        },
        awaitRefetchQueries: true,
        refetchQueries: [getOperationName(GET_TODO_LIST)],
      });
      setItem('');
      toast.success('Tarefa editada!');
    } catch (error) {
      toast.error('Erro ao editar tarefa!', error);
      console.error('Error:', error);
    }
  };

  const onFilter = () => {
    setFilter(item);
    refetch();
  };

  function handleEditarItem(indexItem) {
    setSelectedItem(data?.todoList?.[indexItem]);
    setModalEditarItemVisible(true);
  }

  function handleSaveItem(item) {
    onUpdate(item);
    setModalEditarItemVisible(false);
  }

  function handleCloseModalEditar() {
    setModalEditarItemVisible(false);
  }

  function handleDeleteItem(itemId) {
    onDelete(itemId);
  }

  function handleFilter() {
    onFilter();
  }

  function handleLimparFiltro() {
    setFilter(null);
    refetch();
  }

  return (
    <>
      <Container>
        <ContainerList>
          <Title>Lista de Tarefas</Title>
          <ContainerTop>
            <TextField
              id="item"
              label="Digite aqui"
              value={item}
              type="text"
              variant="standard"
              onChange={e => setItem(e?.target?.value)}
            />
            <ContainerButton>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', width: '100%', gap: '6px' }}>
                <Button
                  variant="contained"
                  sx={{ width: '100%' }}
                  color="info"
                  type="button"
                  onClick={() => handleFilter()}
                >
                  Filtrar
                </Button>
                <Button variant="contained" sx={{ width: '100%' }} color="warning" onClick={() => handleLimparFiltro()}>
                  Limpar Filtro
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: '100%' }}
                  color="success"
                  type="button"
                  onClick={event => onSubmit(event)}
                >
                  Salvar
                </Button>
              </div>
            </ContainerButton>
          </ContainerTop>
          <List sx={{ width: '100%' }}>
            <ContainerListItem>
              {data?.todoList?.length === 0 && <div>Nenhuma tarefa encontrada!</div>}
              {data?.todoList?.map((value, index) => {
                return (
                  <ListItem
                    key={index}
                    disablePadding
                    sx={{
                      borderRadius: '5px',
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    <ListItemButton dense>
                      <ListItemText id={index} primary={value?.name} />
                      <Edit onClick={() => handleEditarItem(index)} />
                      <Delete color="error" onClick={() => handleDeleteItem(value?.id)} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </ContainerListItem>
          </List>
        </ContainerList>
      </Container>
      <If test={modalEditarItemVisible}>
        <ModalEditarItem
          open={modalEditarItemVisible}
          handleClose={() => handleCloseModalEditar()}
          onSave={event => handleSaveItem(event)}
          header="Editar Item"
          selectedItem={selectedItem}
        />
      </If>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1750,
          style: {
            fontSize: '18px',
          },
        }}
      />
    </>
  );
}

export default ListaTarefas;
