import { httpGet, httpPost } from './http';

export async function getAllActivityLogs() {
  return httpGet('/activityLogs');
}

export async function getActivityLogsByUser(username) {
  return httpGet(`/activityLogs?username=${encodeURIComponent(username)}`);
}

export async function createActivityLog(logData) {
  return httpPost('/activityLogs', {
    ...logData,
    timestamp: new Date().toISOString()
  });
}
