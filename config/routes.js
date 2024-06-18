module.exports.routes = {
  "/": { view: "pages/homepage" },
  "POST /api/v1/login": "AuthController.login",

  //===============Admin panel routes=======================

  "POST /api/v1/admin": { action: "admin/doc-create" },
  "GET /api/v1/admin": { action: "admin/doc-get" },
  "GET /api/v1/admin/:page": { action: "admin/doc-get" },
  "PUT /api/v1/admin/:id": { action: "admin/doc-update" },
  "DELETE /api/v1/admin/:id": { action: "admin/doc-delete" },

  //==============Doctor Dashboard routes===================

  "POST /api/v1/doctor": { action: "doctor-dash/schedule-add" },
  "GET /api/v1/doctor/schedule": { action: "doctor-dash/schedule-get" },
  "GET /api/v1/doctor/appointments":{action:"doctor-dash/appointments-get"},
  "DELETE /api/v1/doctor/remove": { action: "doctor-dash/schedule-remove" },

  //===============    user routes    ======================

  "POST /api/v1/user": { action: "user/slots-get" },
  // "POST /api/v1/user": { action: "user/get-availableSlots" },
  "POST /api/v1/user/appointment": { action: "user/slot-book" },

};
