import { apiRequest } from "./api";

export async function getNotifications(token: string) {
  return apiRequest("/notifications", "GET", null, token);
}
