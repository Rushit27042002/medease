// api/models/Schedule.js

module.exports = {
  attributes: {
    id: {
      type: 'number',
      autoIncrement: true,
      unique: true,
    },
    doctorId: {
      model: 'doctor',
      required: true,
    },
    monday: {
      type: 'json',
      example: {
        start: '09:00',
        end: '17:00'
      }
    },
    tuesday: {
      type: 'json',
      example: {
        start: '09:00',
        end: '17:00'
      }
    },
    wednesday: {
      type: 'json',
      example: {
        start: '09:00',
        end: '17:00'
      }
    },
    thursday: {
      type: 'json',
      example: {
        start: '09:00',
        end: '17:00'
      }
    },
    friday: {
      type: 'json',
      example: {
        start: '09:00',
        end: '17:00'
      }
    },
    saturday: {
      type: 'json',
      example: {
        start: '09:00',
        end: '17:00'
      }
    },
    slotDuration: {
      type: 'number',
      required: true,
    },
    breakDuration: {
      type: 'number',
      required: true,
    },
  },
};
