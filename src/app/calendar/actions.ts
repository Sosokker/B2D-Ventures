import { Session, SupabaseClient } from "@supabase/supabase-js";

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
  } catch (error) {
    console.error("Error creating calendar event:", error);
  }
}

interface CreateMeetingLogProps {
  client: SupabaseClient;
  userId: string;
  projectId: number;
  meet_date: string;
  start_time: string;
  end_time: string;
  note: string;
}

export async function createMeetingLog({
  client,
  userId,
  projectId,
  meet_date,
  start_time,
  end_time,
  note,
}: CreateMeetingLogProps) {
  const { error } = await client.from("meeting_log").insert([
    {
      meet_date: meet_date, // Format date as YYYY-MM-DD
      start_time: start_time, // Format time as HH:MM:SS
      end_time: end_time, // Format time as HH:MM:SS
      note: note, // Text for meeting notes
      user_id: userId, // Replace with a valid UUID
      project_id: projectId,
    },
  ]);

  return error ? { status: false, error } : { status: true, error: null };
}
