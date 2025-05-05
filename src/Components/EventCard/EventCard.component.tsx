import { FC, memo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Divider,
  Skeleton
} from '@mui/material';
import { styled, Theme } from '@mui/material/styles';
import { CalendarToday, Person, Group} from '@mui/icons-material';
import { Event } from '../../Context/EventContext';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  event: Event;
  onJoin: (eventId: string) => void;
  isJoined: boolean;
  isDisabled: boolean;
  loading?: boolean;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: '320px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: theme.palette.primary.main,
    borderRadius: '4px 4px 0 0',
  }
}));

const EventCard: FC<EventCardProps> = memo(({ 
  event, 
  onJoin, 
  isJoined, 
  isDisabled,
  loading = false 
}) => {
  if (loading) {
    return (
      <StyledCard>
        <CardContent>
          <Skeleton variant="rectangular" height={24} width="60%" />
          <Skeleton variant="text" height={80} />
          <Skeleton variant="rectangular" height={36} />
        </CardContent>
      </StyledCard>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const navigate = useNavigate();

  return (
    <StyledCard>
      <CardContent sx={{ flexGrow: 1, pb: 1 }} onClick={() => navigate(`/events/${event._id}`)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontWeight: 600,
            background: `linear-gradient(120deg, ${(theme:Theme) => theme.palette.primary.main}, ${(theme:Theme) => theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {event.title}
          </Typography>
          <Chip 
            size="small"
            label={isJoined ? 'Joined' : 'Open'}
            color={isJoined ? 'success' : 'primary'}
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
              <CalendarToday sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="body2">
              {formattedDate}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
              <Person sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="body2">
              {event.host.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.main' }}>
              <Group sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="body2">
              {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'} attending
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant={isJoined ? "outlined" : "contained"}
          color={isJoined ? "success" : "primary"}
          onClick={() => onJoin(event?._id || '')}
          disabled={isDisabled || loading}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: isJoined ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isJoined ? 'none' : '0 6px 16px rgba(0,0,0,0.2)',
            }
          }}
        >
          {isJoined ? '✓ Already Joined' : 'Join Event'}
        </Button>
      </CardActions>
    </StyledCard>
  );
});

export default EventCard;
