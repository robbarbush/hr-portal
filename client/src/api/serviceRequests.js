import { httpGet, httpPost, httpPatch } from './http';

export async function getAllServiceRequests() {
  return httpGet('/serviceRequests');
}

export async function getServiceRequestsByEmployeeId(employeeId) {
  return httpGet(`/serviceRequests?employeeId=${employeeId}`);
}

export async function createServiceRequest(requestData) {
  return httpPost('/serviceRequests', {
    ...requestData,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
}

export async function updateServiceRequestStatus(id, status) {
  return httpPatch(`/serviceRequests/${id}`, { status });
}
