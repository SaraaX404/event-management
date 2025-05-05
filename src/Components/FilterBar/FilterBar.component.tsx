import { FC } from 'react';
import {  Button, Grid, MenuItem, Paper, TextField, useTheme } from '@mui/material';
import { CalendarToday, Clear, Person } from '@mui/icons-material';

interface FilterBarProps {
  filters: {
    host: string;
    date: string;
  };
  userNames: string[];
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
}

export const FilterBar: FC<FilterBarProps> = ({
  filters,
  userNames,
  onFilterChange,
  onClearFilters
}) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 4,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid>
          <TextField
            select
            fullWidth
            name="host"
            label="Filter by host"
            variant="outlined"
            value={filters.host}
            onChange={onFilterChange}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'primary.main' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                }
              }
            }}
          >
            <MenuItem value="">
              <em>All Hosts</em>
            </MenuItem>
            {userNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid >
          <TextField
            fullWidth
            type="date"
            name="date"
            label="Filter by date"
            variant="outlined"
            value={filters.date}
            onChange={onFilterChange}
            InputLabelProps={{ 
              shrink: true,
              sx: { color: 'primary.main' }
            }}
            InputProps={{
              startAdornment: <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                }
              }
            }}
          />
        </Grid>
        <Grid >
          <Button
            variant="contained"
            startIcon={<Clear />}
            onClick={onClearFilters}
            disabled={!filters.host && !filters.date}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              color: 'white',
              '&:disabled': {
                background: theme.palette.grey[300],
                boxShadow: 'none'
              }
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
