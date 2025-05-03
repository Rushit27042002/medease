module.exports = {
    friendlyName: 'Delete Appointment',
  
    description: 'Delete a booked appointment by ID.',
  
    inputs: {
      id: {
        type: 'number',
        required: true,
        description: 'Appointment ID to delete'
      }
    },
  
    exits: {
      success: {
        description: 'Appointment deleted successfully.'
      },
      notFound: {
        description: 'No Appointment found with the specified ID.'
      },
      serverError: {
        description: 'Something went wrong.'
      }
    },
  
    fn: async function (inputs, exits) {
      try {
        const deletedAppointment = await Appointment.destroyOne({ id: inputs.id });
  
        if (!deletedAppointment) {
          return exits.notFound({ error: 'Appointment not found with this ID' });
        }
  
        return exits.success({ message: 'Appointment deleted successfully.' });
  
      } catch (err) {
        return exits.serverError({ error: err.message });
      }
    }
  };
  