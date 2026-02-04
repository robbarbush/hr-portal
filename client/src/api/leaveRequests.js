import { httpGet, httpPost, httpPatch } from './http';

export async function getAllLeaveRequests() {
  return httpGet('/leaveRequests');
}

export async function getLeaveRequestsByEmployeeId(employeeId) {
  return httpGet(`/leaveRequests?employeeId=${employeeId}`);
}

export async function createLeaveRequest(leaveData) {
  return httpPost('/leaveRequests', {
    ...leaveData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}

export async function updateLeaveRequestStatus(id, status) {
  return httpPatch(`/leaveRequests/${id}`, { status });
}
