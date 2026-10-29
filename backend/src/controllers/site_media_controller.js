const db = require('../models');
const SiteMedia = db.SiteMedia;

exports.create = async (req, res) => {
  try {
    const { section_key, display_name, media_type, status } = req.body;
    const exists = await SiteMedia.findOne({ where: { section_key } });
    if (exists) return res.status(400).json({ success: false, message: "Section key already exists" });

    let desktop_url = req.files?.['desktop_media'] ? req.files['desktop_media'][0].path : null;
    let mobile_url = req.files?.['mobile_media'] ? req.files['mobile_media'][0].path : null;

    const media = await SiteMedia.create({ section_key, display_name, media_type, desktop_url, mobile_url, status });
    res.status(201).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const media = await SiteMedia.findByPk(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: "Not found" });

    const updateData = { ...req.body };
    
    // PATCH LOGIC: Only update if new file is uploaded
    if (req.files?.['desktop_media']) updateData.desktop_url = req.files['desktop_media'][0].path;
    if (req.files?.['mobile_media']) updateData.mobile_url = req.files['mobile_media'][0].path;

    await media.update(updateData);
    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const mediaList = await SiteMedia.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: mediaList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByKey = async (req, res) => {
  try {
    const media = await SiteMedia.findOne({ where: { section_key: req.params.key, status: 'active' } });
    if (!media) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const media = await SiteMedia.findByPk(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: "Not found" });
    await media.destroy();
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
