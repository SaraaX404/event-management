import { useEvents } from '../../Context/EventContext';
import { useUser } from '../../Context/UserContext';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Fade,
  CircularProgress,
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import { Event as EventIcon, Star, Groups } from '@mui/icons-material';
import { Layout } from '../../Components';
import { EventCard } from '../../Components';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Event } from '../../Context/EventContext';
import { FilterBar } from '../../Components/FilterBar/FilterBar.component';



const Dashboard = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const { filterEvents, setFilters, filters } = useEvents();
  const { user, userNames } = useUser();
  const { joinEvent, getOtherUsersEvents } = useEvents();

  // Memoize filter change handler
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setFilters({ ...filters, [e.target.name]: e.target.value }); 
  }, [setFilters, filters]);

  // Memoize clear filters handler
  const handleClearFilters = useCallback(() => {
    setLoading(true);
    setFilters({ host: '', date: '' });
  }, [setFilters]);

  // Memoize tab change handler
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  // Apply filters effect
  useEffect(() => {
    const applyFilters = async () => {
      try {
        await filterEvents();
      } catch (error) {
        console.error('Error applying filters:', error);
      } finally {
        setLoading(false);
      }
    };
    applyFilters();
  }, [filters, filterEvents]);

  // Fetch initial events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const otherUsersEvents = getOtherUsersEvents();
        setEvents(otherUsersEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [getOtherUsersEvents]);

  // Memoize filtered events based on active tab
  const filteredEvents = useMemo(() => {
    const currentDate = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      switch (activeTab) {
        case 1: // Upcoming Events
          return eventDate > currentDate;
        case 2: // My Events
          return event.attendees.some(attendee => attendee._id === user?.id);
        default: // All Events
          return true;
      }
    });
  }, [events, activeTab, user?.id]);

  // Memoize statistics calculations
  const stats = useMemo(() => {
    const currentDate = new Date();
    return {
      totalEvents: events.length,
      upcomingEvents: events.filter(event => new Date(event.date) > currentDate).length,
      joinedEvents: events.filter(event => event.attendees.some(attendee => attendee._id === user?.id)).length
    };
  }, [events, user?.id]);

  // Memoize event card rendering logic
  const renderEventCards = useMemo(() => {
    if (filteredEvents.length === 0) {
      return (
        <Grid>
          <Paper sx={{ p: 4, textAlign: 'center', background: theme.palette.grey[50] }}>
            <Typography variant="h6" color="text.secondary">
              No events found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your filters or check back later for new events
            </Typography>
          </Paper>
        </Grid>
      );
    }

    return filteredEvents.map((event) => (
      <Grid key={event._id} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <EventCard
          event={event}
          onJoin={joinEvent}
          isJoined={event.attendees.some(attendee => attendee._id === user?.id)}
          isDisabled={!user || event.attendees.some(attendee => attendee._id === user?.id)}
        />
      </Grid>
    ));
  }, [filteredEvents, theme.palette.grey, user, joinEvent]);

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4, mt: 10 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Welcome back, {user?.name}! 👋
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`, color: 'white' }}>
                <EventIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.totalEvents}</Typography>
                <Typography>Total Events</Typography>
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', background: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main})`, color: 'white' }}>
                <Star sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.upcomingEvents}</Typography>
                <Typography>Upcoming Events</Typography>
              </Paper>
            </Grid>
            <Grid>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center', background: `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.success.main})`, color: 'white' }}>
                <Groups sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{stats.joinedEvents}</Typography>
                <Typography>Events Joined</Typography>
              </Paper>
            </Grid>
          </Grid>

          <FilterBar
            filters={filters}
            userNames={userNames}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="event tabs">
              <Tab label="All Events" />
              <Tab label="Upcoming Events" />
              <Tab label="My Events" />
            </Tabs>
          </Box>
        </Box>

        <Fade in={!loading} timeout={500}>
          <Grid container spacing={3}>
            {renderEventCards}
          </Grid>
        </Fade>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default Dashboard;
