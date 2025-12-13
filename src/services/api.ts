import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});


export const spaceService = {
  getAll: () => api.get('/spaces'),
};

export const bookingService = {
  create: (data: { spaceId: string; startDate: string; durationWeeks: number }) => 
    api.post('/bookings', data),
    
  getPending: () => api.get('/bookings/pending'),
  
  approve: (id: string) => api.patch(`/bookings/${id}/approve`),
  
  getMyAppointments: () => api.get(`/bookings/my-appointments`),
};