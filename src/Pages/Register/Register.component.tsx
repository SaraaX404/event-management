import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useForm } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  useTheme,
  CircularProgress,
  Fade,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Layout } from "../../Components";
import { useState } from "react";
import { Person, Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

type RegisterFormInputs = {
  username: string;
  password: string;
  name: string;
};

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register: registerUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormInputs>({
    mode: "onChange"
  });
  
  const onSubmit = async (data: RegisterFormInputs) => {
    setIsSubmitting(true);
    setError("");
    
    try {
      const result = await registerUser(data.username, data.password, data.name);
      
      if (result.success) {
        // Show success state briefly before navigating
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ mt: 20 }}>
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography 
              component="h1" 
              variant="h4"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                mb: 4
              }}
            >
              Create Account
            </Typography>

            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                width: "100%",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 2
              }}
            >
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoComplete="name"
                  autoFocus
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  label="Username"
                  autoComplete="username"
                  {...register("username", { 
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters"
                    }
                  })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "primary.main" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                    height: 48
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      background: "rgba(33, 150, 243, 0.1)"
                    }
                  }}
                >
                  Already have an account? Login
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
    </Layout>
  );
};

export default Register;