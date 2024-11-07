import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {toast} from "react-hot-toast";

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEditSingleSelectCell,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = Math.floor(Math.random() * 10000).toString();
    setRows((oldRows) => [
      ...oldRows,
      { id, userId: '', reportedUserId: '', reportDescription: '', status: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'userId' },
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

export default function Reports() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://13.235.134.187:3000/admin/reports', {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (data.success) {
          const formattedData = data.result.map((item) => ({
            ...item,
            isNew: false,
          }));
          setRows(formattedData);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
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
    const shouldDelete = window.confirm('Are you sure you want to delete this report?');
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

    // Send PUT request to update the status
    try {
      console.log(newRow.id)
      const response = await fetch(`http://13.235.134.187:3000/admin/resolve-report/${newRow.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newRow.status }),
      });
      
      const result = await response.json();
      if (result.success) {
        toast.success("Status Updated..")
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      } else {
        console.error('Failed to update status:', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'id', headerName: 'Report Id', width: 250, editable: false },
    { field: 'userId', headerName: 'User ID', width: 250, editable: false },
    { field: 'userName', headerName: 'User Name', width: 250, editable: false },
    { field: 'reportedUserId', headerName: 'Reported User ID', width: 250, editable: false },
    { field: 'reportedUserName', headerName: 'Reported User Name', width: 250, editable: false },
    { field: 'reportDescription', headerName: 'Report Description', width: 300, editable: false },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
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
    { field: 'createdAt', headerName: 'Reported Date', width: 300, editable: false },
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
      <Typography variant="h4" align='center'>Reports</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{ Toolbar: EditToolbar }}
        componentsProps={{ toolbar: { setRows, setRowModesModel } }}
      />
    </Box>
  );
}
