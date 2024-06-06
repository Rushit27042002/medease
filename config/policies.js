/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,

  //admin policies
  "admin/doc-create": "isAdmin",
  "admin/doc-get": "isAdmin",
  "admin/doc-update": "isAdmin",
  "admin/doc-delete": "isAdmin",

  //doctor policies
  "doctor-dash/schedule-add":"isDoctor",
  "doctor-dash/schedule-get":"isDoctor",
  "doctor-dash/schedule-remove":"isDoctor",
  "doctor-dash/appointments-get":"isDoctor",
};
