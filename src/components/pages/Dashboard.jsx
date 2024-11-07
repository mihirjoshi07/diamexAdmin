import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridRowEditStopReasons,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import axios from 'axios'; // Import axios for HTTP requests

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

export default function Dashboard() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://13.126.11.73:3000/admin/users', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Filter out any items that might be null or don't have userId._id
        const formattedData = response.data.result
          .filter(item => item?.userId?._id) // Filter out invalid items
          .map((item) => ({
            id: item.userId._id,
            phoneNumber: item.userId.phoneNumber,
            firstName: item.firstName,
            lastName: item.lastName,
            companyName: item.companyName,
            email: item.email,
            bio: item.bio,
            location: item.location,
            address: item.address,
            preference: item.preference,
            profilePicture: item.profilePicture,
            business_category: item.business_category,
            verificationStatus: item.verificationStatus,
            createdAt: new Date(item.createdAt),
          }));
  
        setRows(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
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

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'id', headerName: 'User Id', width: 220 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 180, editable: false },
    { field: 'firstName', headerName: 'First Name', width: 180, editable: false },
    { field: 'lastName', headerName: 'Last Name', width: 180, editable: false },
    { field: 'companyName', headerName: 'Company Name', width: 180, editable: false },
    { field: 'email', headerName: 'Email', width: 180, editable: false },
    { field: 'bio', headerName: 'Bio', width: 180, editable: false },
    { field: 'location', headerName: 'Location', width: 180, editable: false },
    { field: 'address', headerName: 'Address', width: 180, editable: false },
    { field: 'preference', headerName: 'Preference', width: 180, editable: false },
    {
      field: 'profilePicture',
      headerName: 'Profile Picture',
      width: 180,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: 'business_category', headerName: 'Business Category', width: 180, editable: false },
    {
      field: 'verificationStatus',
      headerName: 'Verification Status',
      width: 180,
      editable: false, // Make this field read-only
    },
    { field: 'createdAt', headerName: 'Created At', width: 180, editable: false },
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
      <Typography variant="h4" align='center'>Users</Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { setRows, setRowModesModel } }}
      />
    </Box>
  );
}
