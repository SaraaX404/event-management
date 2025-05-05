import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { Event } from '../../Context/EventContext';
import { Layout } from '../../Components';
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Fade,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Event as EventIcon,
  Person,
  Group
} from '@mui/icons-material';
import { useUser } from '../../Context/UserContext';
import { useEvents } from '../../Context/EventContext';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { user } = useUser();
  const { joinEvent } = useEvents();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
      } catch (err) {
        setError('Failed to fetch event details');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleJoinEvent = async () => {
    if (!event) return;
    try {
      await joinEvent(event._id);
      // Refresh event details
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (err) {
      console.error('Error joining event:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <Container>
          <Typography color="error" align="center">
            {error || 'Event not found'}
          </Typography>
        </Container>
      </Layout>
    );
  }

  const isAttending = event.attendees.some(attendee => attendee._id === user?.id);
  const isHost = event.host._id === user?.id;

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Fade in={true}>
          <Paper elevation={3} sx={{ p: 4, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold"
              }}
            >
              {event.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {new Date(event.date).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                Hosted by: {event.host.name}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" color="primary" gutterBottom>
              Attendees
            </Typography>
            <List>
              {event.attendees.map((attendee) => (
                <ListItem key={attendee._id}>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={attendee.name} />
                </ListItem>
              ))}
            </List>

            {!isHost && !isAttending && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleJoinEvent}
                startIcon={<Group />}
                sx={{ mt: 2 }}
              >
                Join Event
              </Button>
            )}
          </Paper>
        </Fade>
      </Container>
    </Layout>
  );
};

export default EventDetails;
