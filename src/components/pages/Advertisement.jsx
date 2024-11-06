import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { toast } from "react-hot-toast";

export default function Advertisement() {
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91'); // Default country code
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const fileInputRef = useRef(null); // Reference for file input

    const phoneLengthMap = {
        '+1': 10,   // USA
        '+44': 10,  // UK
        '+91': 10,  // India
        '+61': 9,   // Australia
        '+81': 10   // Japan
    };

    const handleUserNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handleCountryCodeChange = (event) => {
        setCountryCode(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!userName || !phoneNumber || !image) {
            toast.error('Please provide a user name, phone number, and select an image');
            return;
        }

        // Validate phone number length based on the country code
        const expectedLength = phoneLengthMap[countryCode];
        if (phoneNumber.length !== expectedLength) {
            toast.error(`Phone number must be ${expectedLength} digits long for the selected country`);
            return;
        }

        // Create a FormData object to send the data
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('phoneNumber', `${countryCode}${phoneNumber}`);
        formData.append('file', image);

        setIsLoading(true); // Set loading state to true before the request starts

        try {
            const response = await fetch('http://localhost:3000/admin/AddAdvertisement', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Include credentials to send cookies
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                // Clear the form fields if needed
                setUserName('');
                setPhoneNumber('');
                setCountryCode('+1');
                setImage(null);
                setImagePreview('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the file input
                }
            } else {
                toast.error(`Error: ${result.message}`);
            }
        } catch (error) {
            toast.error('Failed to upload advertisement. Please try again later.');
            console.error('Upload error:', error);
        } finally {
            setIsLoading(false); // Set loading state back to false after request completes
        }
    };

    return (
        <Box display="flex" p={2} gap={4}>
            {/* Left Side: Form for User Name, Phone Number, and File Upload */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
                <Typography variant="h5">Add Advertisement</Typography>
                <TextField
                    label="User Name"
                    variant="outlined"
                    value={userName}
                    onChange={handleUserNameChange}
                    fullWidth
                />
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        select
                        label="Country Code"
                        value={countryCode}
                        onChange={handleCountryCodeChange}
                        variant="outlined"
                        style={{ width: '30%' }}
                    >
                        <MenuItem value="+1">+1 (USA)</MenuItem>
                        <MenuItem value="+44">+44 (UK)</MenuItem>
                        <MenuItem value="+91">+91 (India)</MenuItem>
                        <MenuItem value="+61">+61 (Australia)</MenuItem>
                        <MenuItem value="+81">+81 (Japan)</MenuItem>
                    </TextField>
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        style={{ width: '70%' }}
                        helperText={`Must be ${phoneLengthMap[countryCode]} digits long`}
                    />
                </Box>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginTop: '10px' }}
                    ref={fileInputRef} // Attach the ref to the file input
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={isLoading} // Disable the button when loading
                >
                    {isLoading ? 'Loading...' : 'Upload'}
                </Button>
            </Box>

            {/* Right Side: Display Uploaded Image */}
            <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Uploaded"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                ) : (
                    <Typography variant="body1">No image uploaded yet.</Typography>
                )}
            </Box>
        </Box>
    );
}
