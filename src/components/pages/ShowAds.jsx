import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { toast } from 'react-hot-toast';
import {
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem
} from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

function EditToolbar({ setRows, setRowModesModel }) {
    const handleClick = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setRows((oldRows) => [
            ...oldRows,
            { id, phoneNumber: '', userName: '', adImages: [], advertisementId: '', isNew: true },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: 'edit', fieldToFocus: 'phoneNumber' },
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

export default function ShowAds() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedAdId, setSelectedAdId] = useState('');
    const [selectedAdUrl, setSelectedAdUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://13.126.11.73:3000/admin/showAds', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setRows(data.result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleImageClick = (url, adId) => {
        setSelectedImage(url);
        setSelectedAdId(adId);
        setSelectedAdUrl(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedImage('');
        setSelectedAdId('');
        setSelectedAdUrl('');
    };

    const handleDeleteImage = async () => {
        try {
            const response = await fetch(`http://13.126.11.73:3000/admin/remove-ads/${selectedAdId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ advertisementUrl: selectedAdUrl }),
            });

            if (!response.ok) throw new Error('Failed to delete image');
            toast.success("Advertisement removed successfully");
            setRows((prevRows) =>
                prevRows.map(row =>
                    row.id === selectedAdId
                        ? { ...row, adImages: row.adImages.filter(url => url !== selectedAdUrl) }
                        : row
                )
            );
            handleClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: 'edit' } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: 'view' } });
    };

    const handleDeleteClick = (id) => async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this advertisement?');
        if (confirmDelete) {
            try {
                const response = await fetch(`http://13.126.11.73:3000/admin/deleteAd/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Failed to delete advertisement');
                toast.success("Advertisement deleted successfully");
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: 'view', ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) setRows(rows.filter((row) => row.id !== id));
    };

    const columns = [
        { field: 'id', headerName: 'Advertisement ID', width: 230, editable: false },
        { field: 'phoneNumber', headerName: 'Phone Number', width: 140, editable: true },
        { field: 'userName', headerName: 'User Name', width: 120, editable: true },
        {
            field: 'adImages',
            headerName: 'Images',
            width: 200,
            renderCell: (params) => (
                <Box>
                    {params.value.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt="Ad"
                            style={{ width: 50, height: 50, cursor: 'pointer', marginRight: 5 }}
                            onClick={() => handleImageClick(url, params.row.id)}
                        />
                    ))}
                </Box>
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={handleEditClick(params.id)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(params.id)}
                />,
            ],
        },
    ];

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{
                    Toolbar: EditToolbar,
                }}
                onRowModesModelChange={handleRowModesModelChange}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Image Preview</DialogTitle>
                <DialogContent>
                    <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />
                    <Button onClick={handleDeleteImage} color="error">Delete Image</Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
