import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { toast } from 'react-hot-toast';

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

export default function Documents() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  useEffect(() => {
    // Fetch data from the API
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/documents', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          // Convert date strings to Date objects and set the rows
          const formattedData = data.result.map((item) => ({
            ...item,
            joinDate: new Date(item.joinDate),
          }));
          setRows(formattedData);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
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
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');
    if (confirmDelete) {
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

    // Make API call to update the verification status
    try {
      const response = await fetch(`http://localhost:3000/admin/change-status/${newRow.userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          

        },
        body: JSON.stringify({ status: newRow.verificationStatus }), // Pass the selected status
      });

      const data = await response.json();

      if (data.success) {
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        toast.success("Status updated")
      } else {
        console.error('Failed to update status:', data.message);
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
    }

    return updatedRow; // Return updated row to DataGrid
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'id', headerName: 'Document ID', width: 230 },
    { field: 'userId', headerName: 'User ID', width: 230 },
    {
      field: 'kyc_document',
      headerName: 'KYC',
      width: 180,
      editable: false,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'gst_document',
      headerName: 'GST Certificate',
      width: 180,
      editable: false,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'trade_membership_document',
      headerName: 'Trade Membership Proof',
      width: 180,
      editable: false,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'pan_card',
      headerName: 'Pan Card',
      width: 180,
      editable: false,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'aadhar_document',
      headerName: 'Aadhar Card',
      width: 180,
      editable: false,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    {
      field: 'verificationStatus',
      headerName: 'Verification Status',
      width: 180,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['N/A', 'pending', 'verified'],
      renderEditCell: (params) => (
        <GridEditSingleSelectCell
          {...params}
          valueOptions={['N/A', 'pending', 'verified']}
        />
      ),
    },
    { field: 'ref1_name', headerName: 'Reference1 Name', width: 180, editable: false },
    { field: 'ref1_company', headerName: 'Reference1 Company', width: 180, editable: false },
    { field: 'ref1_phoneNumber', headerName: 'Reference1 Contact', width: 180, editable: false },
    { field: 'ref2_name', headerName: 'Reference2 Name', width: 180, editable: false },
    { field: 'ref2_company', headerName: 'Reference2 Company', width: 180, editable: false },
    { field: 'ref2_phoneNumber', headerName: 'Reference2 Contact', width: 180, editable: false },
    { field: 'ref3_name', headerName: 'Reference3 Name', width: 180, editable: false },
    { field: 'ref3_company', headerName: 'Reference3 Company', width: 180, editable: false },
    { field: 'ref3_phoneNumber', headerName: 'Reference3 Contact', width: 180, editable: false },
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
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Document Verification
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onRowModesModelChange={handleRowModesModelChange}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
