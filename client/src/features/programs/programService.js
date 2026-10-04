import api from '../../services/api';

/**
 * Dynamic Program Management API Service Client
 */
export const programService = {
  /**
   * Fetch paginated list of programs with search and filter parameters
   */
  getPrograms: async (params = {}) => {
    return await api.get('/programs', { params });
  },

  /**
   * Fetch specific program details by ID
   */
  getProgramById: async (id) => {
    return await api.get(`/programs/${id}`);
  },

  /**
   * Create a new program (Admin only)
   */
  createProgram: async (programData) => {
    return await api.post('/programs', programData);
  },

  /**
   * Update program details (Admin only)
   */
  updateProgram: async (id, programData) => {
    return await api.put(`/programs/${id}`, programData);
  },

  /**
   * Change program status (Admin only)
   */
  updateStatus: async (id, status) => {
    return await api.patch(`/programs/${id}/status`, { status });
  }
};

export default programService;
