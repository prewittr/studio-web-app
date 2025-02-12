import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './BookingCalendar.css';

// Helper: Determine operating hours for a given date.
const getOperatingHours = (date) => {
  const day = date.getDay();
  // Weekends: 8am to 7pm; Weekdays: 7am to 8pm.
  if (day === 0 || day === 6) {
    return { startHour: 8, endHour: 19 };
  } else {
    return { startHour: 7, endHour: 20 };
  }
};

// Helper: Generate available time slots for one day based on session type.
const generateTimeSlotsForDay = (date, sessionType) => {
  const slots = [];
  const { startHour, endHour } = getOperatingHours(date);

  let slotDuration, interval;
  if (sessionType === 'infrared') {
    slotDuration = 60;
    interval = 60;
  } else if (sessionType === 'redlight') {
    slotDuration = 25;
    interval = 30;
  } else {
    return slots;
  }

  // Calculate last valid start time (ensuring the session finishes before closing)
  let current = new Date(date);
  current.setHours(startHour, 0, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, 0, 0, 0);
  const slotDurationMs = slotDuration * 60000;
  const lastValid = new Date(endTime.getTime() - slotDurationMs);

  while (current <= lastValid) {
    slots.push({
      title: sessionType === 'infrared' ? 'Sauna' : 'Redlight',
      start: new Date(current),
      extendedProps: { sessionType }
    });
    current = new Date(current.getTime() + interval * 60000);
  }
  return slots;
};

// Custom rendering of events to simplify their appearance.
const renderEventContent = (eventInfo) => {
  // Only show a short title.
  return (
    <div className="fc-event-custom">
      <strong>{eventInfo.event.title}</strong>
    </div>
  );
};

const BookingCalendar = ({ sessionType, onSelectTime }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventsArray = [];
    const today = new Date();
    // Generate events for the next 4 weeks (28 days), excluding past dates.
    for (let i = 0; i < 28; i++) {
      const day = new Date(today.getTime());
      day.setDate(today.getDate() + i);
      // Generate time slots only for each day within operating hours.
      const slots = generateTimeSlotsForDay(day, sessionType);
      eventsArray.push(...slots);
    }
    setEvents(eventsArray);
  }, [sessionType]);

  // When an event is clicked, pass its start time to the parent.
  const handleEventClick = (info) => {
    onSelectTime(info.event.start);
  };

  return (
    <div className="booking-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        // Only allow dates from today onward.
        validRange={{
          start: new Date(),
          end: new Date(new Date().getTime() + 28 * 24 * 60 * 60000)
        }}
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
      />
    </div>
  );
};

export default BookingCalendar;
