module.exports = (sequelize, DataTypes) => {
  const SiteMedia = sequelize.define("SiteMedia", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    section_key: { type: DataTypes.STRING, allowNull: false, unique: true },
    display_name: { type: DataTypes.STRING, allowNull: false },
    media_type: { type: DataTypes.ENUM("image", "video"), allowNull: false, defaultValue: "image" },
    desktop_url: { type: DataTypes.STRING, allowNull: true },
    mobile_url: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" },
  }, { tableName: "site_media", timestamps: true });
  return SiteMedia;
};
