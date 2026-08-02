import api from "../api/axios";

const employeeService = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  create: (employee) => api.post("/employees", employee),
  update: (id, employee) => api.put(`/employees/${id}`, employee),
  remove: (id) => api.delete(`/employees/${id}`),

  getByDepartment: (department) => api.get(`/employees/department/${department}`),
  getAboveSalary: (salary) => api.get(`/employees/highsalary?salary=${salary}`),
  getCount: () => api.get("/employees/count"),
  getSortedBySalary: () => api.get("/employees/sort"),
  getPage: (page = 0, size = 5) => api.get(`/employees/page?page=${page}&size=${size}`),
  getAboveAverage: () => api.get("/employees/above-average"),
};

export default employeeService;