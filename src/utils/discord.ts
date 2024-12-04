export async function sendDiscordNotification(message: string) {
  // Använd process.env istället för window.env
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook URL is not configured");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
  }
}
