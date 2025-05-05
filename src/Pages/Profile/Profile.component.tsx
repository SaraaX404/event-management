import { useEffect, useState } from 'react';
import { useEvents } from '../../Context/EventContext';
import { useUser } from '../../Context/UserContext';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Avatar
} from '@mui/material';
import { Layout } from '../../Components';
import { EventCard } from '../../Components';
import { Event } from '../../Context/EventContext';

const Profile = () => {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const { getMyEvents } = useEvents();
  const { user } = useUser();

  useEffect(() => {
    const userEvents = getMyEvents();
    setMyEvents(userEvents);
  }, [getMyEvents]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                mr: 3,
                bgcolor: 'primary.main'
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.username}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography variant="h5" sx={{ mb: 3 }}>
          My Events
        </Typography>

        <Grid container spacing={3}>
          {myEvents.length > 0 ? (
            myEvents.map((event) => (
              <Grid key={event._id}>
                <EventCard
                  event={event}
                  onJoin={() => {}}
                  isJoined={false}
                  isDisabled={true}
                />
              </Grid>
            ))
          ) : (
            <Grid>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  You haven't created any events yet
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Profile;
