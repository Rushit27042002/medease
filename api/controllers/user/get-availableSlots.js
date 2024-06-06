// api/controllers/get-available-slots.js

const tryNew = require("../../services/tryNew");

module.exports = {
    friendlyName: 'Get Available Slots',
  
    description: 'Fetch available slots for all doctors for a given date.',
  
    inputs: {
      date: {
        type: 'string',
        required: true,
        description: 'The date for which slots are requested. Format: YYYY-MM-DD',
      },
    },
  
    exits: {
      success: {
        description: 'Available slots fetched successfully.',
      },
      invalidInput: {
        responseType: 'badRequest',
        description: 'Invalid input data.',
      },
      serverError: {
        responseType: 'serverError',
        description: 'Something went wrong on the server.',
      },
    },
  
    fn: async function ({ date }, exits) {
      try {
        if (!date) {
          return exits.invalidInput({ error: 'Date is required.' });
        }
  
        // Fetch all doctors
        const doctors = await Doctor.find();
  
        // Prepare results array to store available slots for each doctor
        const results = [];
  
        // Loop through each doctor and compute available slots
        for (const doctor of doctors) {
          const Schedule = await schedule.findOne({ doctorId: doctor.id });
          if (!Schedule) {
            results.push({
              doctorId: doctor.id,
              doctorName: doctor.name,
              slots: [],
            });
            continue;
          }
  
          // Generate slots for the doctor's schedule
          const { slots, bookedSlotSet } = await tryNew.generateSlots(
            Schedule.startTime,
            Schedule.endTime,
            Schedule.slotDuration,
            Schedule.breakDuration,
            date
          );
  
          // Filter out the booked slots for this doctor
          const availableSlots = slots.filter(slot => !bookedSlotSet.has(`${slot.startTime}-${slot.endTime}-${doctor.id}`));
  
          // Push the doctor's available slots to the results array
          results.push({
            doctorId: doctor.id,
            doctorName: doctor.name,
            slots: availableSlots.map(({ startTime, endTime }) => ({ startTime, endTime })),
          });
        }
  
        // Respond with the results
        return exits.success(results);
      } catch (error) {
        console.error(error);
        return exits.serverError({ error: 'An error occurred while fetching available slots.' });
      }
    },
  };
  