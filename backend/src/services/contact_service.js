const db = require('../models');
const { Op } = require('sequelize');

const Contact = db.Contact;

class ContactService {

  // CREATE CONTACT
  async createContact(data) {
    const { name, email, phone, service_needed, budget_range, project_description } = data;

    // Basic validation
    if (!name || !email || !project_description) {
      throw new Error('Name, email, and project description are required');
    }


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
  async getAllContacts(filters = {}) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.email) {
      where.email = {
        [Op.like]: `%${filters.email}%`
      };
    }

    if (filters.phone) {
      where.phone = {
        [Op.like]: `%${filters.phone}%`
      };
    }

    if (filters.name) {
      where.name = {
        [Op.like]: `%${filters.name}%`
      };
    }

    const contacts = await Contact.findAll({
      where,
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


  // GET CONTACT BY ID
  async getContactByUserEmail(email) {
    const contact = await Contact.findByPk(email);
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