import { supabase } from "@/lib/supabase";

export async function sendNotification(
  userId: string,
  title: string,
  message: string
) {
  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: userId,
        title,
        message,
      },
    ]);

  if (error) {
    console.log(
      "Notification error:",
      error.message
    );
  }
}