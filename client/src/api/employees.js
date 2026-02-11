import { httpGet, httpPost, httpPatch, httpDelete } from './http';

export async function getAllEmployees() {
  return httpGet('/employees');
}

export async function getEmployeeById(id) {
  return httpGet(`/employees/${id}`);
}

export async function getEmployeeByEmail(email) {
  const employees = await httpGet(`/employees?email=${encodeURIComponent(email)}`);
  return employees.length > 0 ? employees[0] : null;
}

export async function createEmployee(employeeData) {
  return httpPost('/employees', employeeData);
}

export async function updateEmployee(id, employeeData) {
  return httpPatch(`/employees/${id}`, employeeData);
}

export async function deleteEmployee(id) {
  return httpDelete(`/employees/${id}`);
}
