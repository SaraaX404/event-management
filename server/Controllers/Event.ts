import { Request, Response } from 'express';
import Event from '../Modals/Event';

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, date } = req.body;
    
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const event = new Event({
      id: Math.random().toString(36).substring(2, 11),
      title,
      date,
      host: req.user.id,
      attendees: [req.user.id] // Host is automatically an attendee
    });

    await event.save();

    res.json({
      success: true,
      event
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find()
      .populate('host', 'id name')
      .populate('attendees', 'id name');

    res.json({
      success: true,
      events
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get an event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate('host', 'id name')
      .populate('attendees', 'id name');

    if (!event) {
      res.status(404).json({ message: 'Event not found' }); 
      return;
    }

    res.json({
      success: true,
      event
    }); 

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



// Delete an event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const event = await Event.findOne({ id: eventId });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user is the host
    if (event.host !== req.user.id) {
      res.status(403).json({ message: 'Not authorized to delete this event' });
      return;
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { title, date } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const event = await Event.findOne({ id: eventId });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user is the host
    if (event.host.toString() !== req.user.id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this event' });
      return;
    }

    event.title = title || event.title;
    event.date = date || event.date;

    await event.save();

    res.json({
      success: true,
      event
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Attend an event
export const attendEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user is already attending
    if (event.attendees.includes(req.user.id)) {
      res.status(400).json({ message: 'Already attending this event' });
      return;
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.json({
      success: true,
      event
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Unattend an event
export const unattendEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const event = await Event.findOne({ id: eventId });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    // Check if user is the host
    if (event.host === req.user.id) {
      res.status(400).json({ message: 'Host cannot unattend their own event' });
      return;
    }

    // Check if user is actually attending
    if (!event.attendees.includes(req.user.id)) {
      res.status(400).json({ message: 'Not attending this event' });
      return;
    }

    event.attendees = event.attendees.filter(
      attendeeId => attendeeId !== req.user?.id
    );
    
    await event.save();

    res.json({
      success: true,
      event
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
