import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { useForm } from 'react-hook-form';
import { 
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Fade,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Layout } from '../../Components';
import { useState } from 'react';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(data.email, data.password);
      // Show success state briefly before navigating
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Layout>
      <Container component="main" maxWidth="sm" sx={{ mt: 20 }}>
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography 
              component="h1" 
              variant="h4"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                mb: 4
              }}
            >
              Welcome Back
            </Typography>

            <Paper 
              elevation={3}
              sx={{
                p: 4,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2
              }}
            >
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={!isValid || isSubmitting}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    height: 48
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/register')}
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      background: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  Don't have an account? Register
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Layout>
  );
};

export default Login;