import { Session } from "@supabase/supabase-js";

export async function createCalendarEvent(
  session: Session,
  start: Date,
  end: Date,
  eventName: string,
  eventDescription: string
) {
  console.log("Creating calendar event");

  const event = {
    summary: eventName,
    description: eventDescription,
    start: {
      dateTime: start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };

  try {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + session.provider_token,
      },
      body: JSON.stringify(event),
    });

    const data = await response.json();
    console.log(data);
    alert("Event created, check your Google Calendar!");
  } catch (error) {
    console.error("Error creating calendar event:", error);
    alert("Failed to create the event.");
  }
}
