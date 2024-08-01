const Contacts = require("../Models/Contacts");
const { successMessage } = require("../utils/ResponseMessage");

// Create a new contact
exports.createContact = async (req, res) => {
  const { patientId, doctorId } = req.body;

  try {
    const newContact = new Contacts({ patientId, doctorId });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get patients contact by ID
exports.getPatientsContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contacts.find({ patientId: id }).populate("doctorId");
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    return successMessage(res, contact, "");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getDoctorsContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contacts.find({ doctorId: id }).populate("patientId");
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update contact by ID
exports.updateContactById = async (req, res) => {
  const { id } = req.params;
  const { userId, contactId, user_type } = req.body;

  try {
    const updatedContact = await Contacts.findByIdAndUpdate(
      id,
      { userId, contactId, user_type },
      { new: true, runValidators: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete contact by ID
exports.deleteContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contacts.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
