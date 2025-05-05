import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  useTheme,
  Fade,
  InputAdornment
} from "@mui/material";
import { Layout } from "../../Components";
import { useEvents } from "../../Context/EventContext";
import { useUser } from "../../Context/UserContext";
import { useState } from "react";
import { EventAvailable, Description, LocationOn, CalendarToday } from "@mui/icons-material";

type CreateEventFormInputs = {
  title: string;
  description: string;
  date: string;
  location: string;
};

const steps = ["Event Details", "Date & Time", "Location", "Review"];

const CreateEvent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { user } = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<CreateEventFormInputs>({
    mode: "onChange"
  });

  const formValues = watch();

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data: CreateEventFormInputs) => {
    setIsSubmitting(true);
    setError("");
    
    try {
      createEvent({
          ...data,
          host: {
              _id: user?.id || "",
              name: user?.name || ""
          },
          attendees: []
      });
      
      // Show success state briefly before navigating
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setError("Failed to create event. Please try again.");
      console.error("Failed to create event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <Box>
              <TextField
                margin="normal"
                fullWidth
                id="title"
                label="Event Title"
                autoFocus
                {...register("title", { required: "Title is required" })}
                error={!!errors.title}
                helperText={errors.title?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventAvailable sx={{ mr: 1, color: "primary.main" }} />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                multiline
                rows={4}
                {...register("description", { required: "Description is required" })}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description sx={{ mr: 1, color: "primary.main" }} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={true}>
            <TextField
              margin="normal"
              fullWidth
              id="date"
              label="Event Date"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              {...register("date", { required: "Date is required" })}
              error={!!errors.date}
              helperText={errors.date?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                  </InputAdornment>
                )
              }}
            />
          </Fade>
        );
      case 2:
        return (
          <Fade in={true}>
            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Location"
              {...register("location", { required: "Location is required" })}
              error={!!errors.location}
              helperText={errors.location?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                  </InputAdornment>
                )
              }}
            />
          </Fade>
        );
      case 3:
        return (
          <Fade in={true}>
            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Event Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Title:</strong> {formValues.title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Description:</strong> {formValues.description}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Date:</strong> {new Date(formValues.date).toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Location:</strong> {formValues.location}
                </Typography>
              </Box>
            </Paper>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
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
            Create New Event
          </Typography>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              width: "100%",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)"
            }}
          >
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {getStepContent(activeStep)}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0 || isSubmitting}
                  variant="outlined"
                >
                  Back
                </Button>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    onClick={() => navigate("/")}
                    disabled={isSubmitting}
                    variant="text"
                  >
                    Cancel
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      onClick={()=>onSubmit(formValues)}
                      variant="contained"
                      disabled={!isValid || isSubmitting}
                      sx={{
                        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      disabled={!isValid}
                      sx={{
                        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default CreateEvent;
