const ProductOrder = require("../Models/ProductOrder"); // adjust the path as needed
const { productOrderSchema } = require("../utils/SchemaValidations");
const { createError, successMessage } = require("../utils/ResponseMessage"); // adjust the path as needed
const Patient = require("../Models/Patient");
const Appointment = require("../Models/Appointment");
const Doctor = require("../Models/Doctor");
const Prescription = require("../Models/Prescription");
const User = require("../Models/User");

const productOrderController = {
  // Create a new ProductOrder
  createProductOrder: async (req, res) => {
    try {
      const { name, mobile_no, email, address, products, total_amount } =
        req.body;

      const { error } = productOrderSchema.validate(req.body);
      if (error) {
        return createError(res, 400, error.details[0].message);
      }

      const newOrder = new ProductOrder({
        name,
        mobile_no,
        email,
        address,
        products,
        total_amount,
        status: 1,
      });
      const savedOrder = await newOrder.save();
      return successMessage(
        res,
        savedOrder,
        "Product order created successfully"
      );
    } catch (error) {
      return createError(res, 400, error.message);
    }
  },

  // Read (Get) a single ProductOrder by ID
  getProductOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await ProductOrder.findById(id).populate("products");
      if (!order) {
        return createError(res, 404, "Product order not found");
      }
      return successMessage(res, order, "Product order fetched successfully");
    } catch (error) {
      return createError(res, 400, error.message);
    }
  },

  // Read (Get) all ProductOrders
  getAllProductOrders: async (req, res) => {
    try {
      const orders = await ProductOrder.find().populate({
        path: "products.productId",
        model: "Product",
      });
      return successMessage(res, orders, "Product orders fetched successfully");
    } catch (error) {
      return createError(res, 400, error.message);
    }
  },

  // Update a ProductOrder by ID
  updateProductOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedOrder = await ProductOrder.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedOrder) {
        return createError(res, 404, "Product order not found");
      }
      return successMessage(
        res,
        updatedOrder,
        "Product order updated successfully"
      );
    } catch (error) {
      return createError(res, 400, error.message);
    }
  },

  // Delete a ProductOrder by ID
  deleteProductOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedOrder = await ProductOrder.findByIdAndDelete(id);
      if (!deletedOrder) {
        return createError(res, 404, "Product order not found");
      }
      return successMessage(
        res,
        deletedOrder,
        "Product order deleted successfully"
      );
    } catch (error) {
      return createError(res, 400, error.message);
    }
  },

  placeAppointment: async (req, res) => {
    try {
      if (!req.body.patientId) {
        const PatientAvailable = await Patient.findOne({
          mobile_no: req.body.mobile_no,
          name: req.body.name,
        });
        // console.log(PatientAvailable);
        if (PatientAvailable) {
          try {
            const {
              name,
              email,
              mobile_no,
              age,
              imageUrl,
              gender,
              address,
              doctorId,
              date,
              consult_type,
              time_slot,
            } = req.body;
            if (
              !name ||
              !email ||
              !mobile_no ||
              !imageUrl ||
              !gender ||
              !age ||
              !time_slot ||
              !doctorId ||
              !address
            ) {
              return createError(res, 422, "Required field are undefined!");
            } else {
              const patient = await Patient.findOne({
                name: req.body.name,
                mobile_no: req.body.mobile_no,
              });
              console.log(req.body, patient);
              if (!patient)
                return createError(res, 404, "Invalid Patient not found!");

              const doctor = await Doctor.findOne({ _id: req.body.doctorId });
              if (!doctor) {
                return createError(res, 404, "Invalid ID Doctor not found!");
              }

              if (req.body.time_slot) {
                const app_exists = await Appointment.exists({
                  doctorId: doctor._id,
                  time_slot,
                });
                if (app_exists) {
                  return createError(
                    res,
                    400,
                    "Selected time slot already reserved!"
                  );
                }
              } else {
                return createError(res, 422, "Time slot is required!");
              }

              const addPrescription = await Prescription({
                history_complaints: "",
                assessment: "",
                differential_diagnosis: "",
                management: "",
                remarks: "",
                exercises: [""],
                date: Math.floor(new Date(date) / 1000),
              });

              await addPrescription.save();
              const addAppointment = await Appointment({
                time_slot,
                patientId: patient._id,
                doctorId: doctor._id,
                patient_name: patient.name,
                doctor_name: doctor.name,
                consult_type,
                date: Math.floor(new Date(date) / 1000),
                prescription: addPrescription._id,
              });

              await addAppointment.save();

              if (addAppointment) {
                return successMessage(
                  res,
                  addAppointment,
                  "Appointment Successfully added!"
                );
              } else return createError(res, 400, "Unable to add Appointment!");
            }
          } catch (error) {
            return createError(res, 400, error.message);
          }
        } else {
          try {
            const {
              name,
              email,
              mobile_no,
              age,
              imageUrl,
              gender,
              address,
              patientId,
              doctorId,
              date,
              consult_type,
              time_slot,
            } = req.body;
            if (
              !name ||
              !email ||
              !mobile_no ||
              !imageUrl ||
              !gender ||
              !age ||
              !doctorId ||
              !time_slot ||
              !address
            ) {
              return createError(res, 422, "Required field are undefined!");
            } else {
              const addPatient = new Patient({
                name,
                mobile_no,
                gender,
                age,
                address,
                imageUrl,
              });
              await addPatient.save();
              if (!addPatient)
                return createError(res, 400, "Unable to add new Patient!");

              const createAccount = new User({
                name,
                mobile_no,
                patientId: addPatient._id,
                role: 3,
              });
              await createAccount.save();

              const doctor = await Doctor.findOne({ _id: req.body.doctorId });
              if (!doctor) {
                return createError(res, 404, "Invalid ID Doctor not found!");
              }
              const addPrescription = await Prescription({
                history_complaints: "",
                assessment: "",
                differential_diagnosis: "",
                management: "",
                remarks: "",
                exercises: [""],
                date: Math.floor(new Date(date) / 1000),
              });

              await addPrescription.save();

              const addAppointment = await Appointment({
                time_slot,
                patientId: addPatient._id,
                doctorId: doctor._id,
                patient_name: addPatient.name,
                doctor_name: doctor.name,
                consult_type: consult_type,
                date: Math.floor(new Date(date) / 1000),
                prescription: addPrescription._id,
              });

              await addAppointment.save();

              if (addAppointment) {
                return successMessage(
                  res,
                  addAppointment,
                  "Appointment Successfully added!"
                );
              } else return createError(res, 400, "Unable to add Appointment!");
            }
          } catch (error) {
            console.log(error);
            return createError(res, 400, error.message);
          }
        }
      } else {
        try {
          const {
            name,
            email,
            mobile_no,
            age,
            imageUrl,
            gender,
            address,
            patientId,
            doctorId,
            date,
            time_slot,
          } = req.body;
          if (
            !name ||
            !email ||
            !mobile_no ||
            !imageUrl ||
            !gender ||
            !age ||
            !doctorId ||
            !time_slot ||
            !address
          ) {
            return createError(res, 422, "Required field are undefined!");
          } else {
            const patient = await Patient.findOne({
              _id: patientId,
            });
            console.log(patientId, patient);
            if (!patient)
              return createError(res, 404, "Invalid ID Patient not found!");

            const doctor = await Doctor.findOne({ _id: doctorId });
            if (!doctor) {
              return createError(res, 404, "Invalid ID Doctor not found!");
            }

            const addPrescription = await Prescription({
              history_complaints: "",
              assessment: "",
              differential_diagnosis: "",
              management: "",
              remarks: "",
              exercises: [""],
              date: Math.floor(new Date(date) / 1000),
            });

            await addPrescription.save();

            const addAppointment = await Appointment({
              time_slot,
              patientId: patient._id,
              doctorId: doctor._id,
              patient_name: patient.name,
              doctor_name: doctor.name,
              consult_type,
              date: Math.floor(new Date(date) / 1000),
              prescription: addPrescription._id,
            });

            await addAppointment.save();

            if (addAppointment) {
              return successMessage(
                res,
                addAppointment,
                "Appointment Successfully added!"
              );
            } else return createError(res, 400, "Unable to add Appointment!");
          }
        } catch (error) {
          return createError(res, 400, { error: error.message });
        }
      }
    } catch (error) {
      return createError(res, 422, error.message);
    }
  },
};

module.exports = productOrderController;
