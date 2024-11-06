import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import axios from 'axios';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridEditSingleSelectCell,
} from '@mui/x-data-grid';
import toast from 'react-hot-toast';

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = Math.floor(Math.random() * 10000).toString();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', age: '', role: '', joinDate: new Date(), isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function Feedback() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/feedbacks', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const formattedData = response.data.result.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    const shouldDelete = window.confirm('Are you sure you want to delete this feedback?');
    if (shouldDelete) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };

    // Update status on backend
    try {
      const response = await axios.put(`http://localhost:3000/admin/resolve-feedback/${newRow.id}`, {
        status: newRow.status,
      }, {
        withCredentials: true, // Ensure credentials are sent
      });

      if (response.data.success) {
        toast.success("Status Updated")
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Optionally handle errors here (e.g., notify user)
    }

    return newRow; // Return the original row in case of error
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'id', headerName: 'FeedBackID', width: 250, editable: false },
    { field: 'userId', headerName: 'userID', width: 250, editable: false },
    { field: 'userName', headerName: 'User Name', width: 130, editable: false },
    { field: 'description', headerName: 'Description', width: 180, editable: false },
    {
      field: 'feedbackimage',
      headerName: 'ImageUrl',
      width: 180,
      editable: false,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'status',
      headerName: 'Status', 
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['pending', 'resolved'],
      renderEditCell: (params) => (
        <GridEditSingleSelectCell
          {...params}
          valueOptions={['pending', 'resolved']}
        />
      ),
    },
    { field: 'createdAt', headerName: 'Submitted Date', width: 210, editable: false },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%', '& .actions': { color: 'text.secondary' } }}>
      <Typography variant="h4" align="center">Feedbacks</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
      />
    </Box>
  );
}
