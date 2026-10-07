const contactService = require('../services/contact_service');

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const contact = await contactService.createContact(req.body);

    return res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contact
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL CONTACTS (will be protected later with middleware)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts();

    return res.status(200).json({
      success: true,
      message: 'Contacts retrieved successfully',
      data: contacts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET CONTACT BY ID (will be protected later with middleware)
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactService.getContactById(id);

    return res.status(200).json({
      success: true,
      message: 'Contact retrieved successfully',
      data: contact
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE CONTACT STATUS (will be protected later with middleware)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await contactService.updateContactStatus(id, status);

    return res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};