import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice'; // Adjust the path if necessary
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation

const providers = [{ id: 'credentials', name: 'Email and Password' }];

export default function Login() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (provider, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('http://13.232.5.203:3000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setUser()); // Update the Redux state to logged in
        toast.success("Welcome Admin");
      } else {
        toast.error(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://13.232.5.203:3000/admin/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('OTP sent to your email for password reset.');
        navigate('/reset-password'); // Navigate to the reset password page if needed
      } else {
        const data = await response.json();
        toast.error(`Failed to send OTP: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        slotProps={{
          emailField: { variant: 'standard' },
          passwordField: { variant: 'standard' },
          submitButton: { variant: 'outlined' },
        }}
        providers={providers}
      />
      {/* Forget Password Link */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Link to="/reset-password" onClick={handleResetPassword}>
          Reset Password using OTP
        </Link>
      </div>
    </AppProvider>
  );
}
