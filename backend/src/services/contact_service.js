const db = require('../models');
const Contact = db.Contact;

class ContactService {

  // CREATE CONTACT
  async createContact(data) {
    const { name, email, phone, service_needed, budget_range, project_description } = data;

    // Basic validation
    if (!name || !email || !project_description) {
      throw new Error('Name, email, and project description are required');
    }

    // Check for existing contact with same email (optional - depends on business logic)
    // const existing = await Contact.findOne({ where: { email } });
    // if (existing) {
    //   throw new Error('Contact with this email already exists');
    // }

    const contact = await Contact.create({
      name,
      email,
      phone,
      service_needed,
      budget_range,
      project_description,
      status: 'new'
    });

    return contact;
  }

  // GET ALL CONTACTS (for admin dashboard)
  async getAllContacts() {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });

    return contacts;
  }

  // GET CONTACT BY ID
  async getContactById(id) {
    const contact = await Contact.findByPk(id);

    if (!contact) {
      throw new Error('Contact not found');
    }

    return contact;
  }

  // UPDATE CONTACT STATUS
  async updateContactStatus(id, status) {
    const validStatuses = ['new', 'read', 'responded', 'archived'];

    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      throw new Error('Contact not found');
    }

    contact.status = status;
    await contact.save();

    return contact;
  }
}

module.exports = new ContactService();