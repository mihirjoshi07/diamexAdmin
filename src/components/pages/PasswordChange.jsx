import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    styled,
} from "@mui/material";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";

const StyledContainer = styled(Container)(({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
}));

const FormSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: "#ffffff",
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
        transform: "translateY(-5px)",
    },
}));

const ImageSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
        marginTop: theme.spacing(4),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const ErrorText = styled(Typography)(({ theme }) => ({
    color: theme.palette.error.main,
    fontSize: "0.75rem",
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
}));

const PasswordChange = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const newErrors = {};

        if (formData.newPassword && formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters long";
        }

        if (formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
    }, [formData.newPassword, formData.confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({}); // Clear any existing errors

        try {
            const response = await fetch("http://13.235.134.187:3000/admin/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies in the request
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
                throw new Error(errorData.message || "Password change failed"); // Use backend message
            }

            // Handle successful password change
            const successData = await response.json();
            toast.success(successData.message); // Use success message from backend
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" }); // Clear inputs
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <StyledContainer maxWidth="lg">
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <FormSection component="form" onSubmit={handleSubmit}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                            Change Password
                        </Typography>
                        <StyledTextField
                            fullWidth
                            label="Old Password"
                            name="oldPassword"
                            type="password"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="Enter your old password"
                            required
                            inputProps={{ "aria-label": "old password" }}
                        />
                        <StyledTextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            required
                            inputProps={{ "aria-label": "new password" }}
                            error={!!errors.newPassword}
                        />
                        {errors.newPassword && (
                            <ErrorText>
                                <FaExclamationTriangle />
                                {errors.newPassword}
                            </ErrorText>
                        )}
                        <StyledTextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            required
                            inputProps={{ "aria-label": "confirm password" }}
                            error={!!errors.confirmPassword}
                        />
                        {errors.confirmPassword && (
                            <ErrorText>
                                <FaExclamationTriangle />
                                {errors.confirmPassword}
                            </ErrorText>
                        )}
                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isLoading || Object.keys(errors).length > 0}
                                sx={{ minWidth: 120 }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : "Submit"}
                            </Button>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                            Note: Please ensure your new password is strong and contains a mix of letters, numbers, and special characters.
                        </Typography>
                    </FormSection>
                </Grid>
                <Grid item xs={12} md={6}>
                    <ImageSection>
                        <FaLock size={48} color="#1976d2" />
                        <Typography variant="h4" sx={{ mt: 3, mb: 2, fontWeight: "bold" }}>
                            Change Your Password
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Update your password to enhance your account security. Make sure to choose a strong password to protect your data.
                        </Typography>
                    </ImageSection>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default PasswordChange;
