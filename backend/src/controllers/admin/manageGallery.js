const Gallery = require("../../models/galleryModel");
const cloudinary = require("../../config/cloudinary");

/**
 * @desc    Upload an image to gallery
 * @route   POST /api/admin/gallery
 * @access  Private/Admin
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    const { category } = req.body;

    if (!category) {
      // If we uploaded to Cloudinary but failed validation, we should clean up
      await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // req.file contains the file info from Cloudinary via multer-storage-cloudinary
    const newImage = await Gallery.create({
      imageUrl: req.file.path,
      publicId: req.file.filename,
      category,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    // Cleanup on error if file was uploaded
    if (req.file && req.file.filename) {
      await cloudinary.uploader.destroy(req.file.filename).catch(console.error);
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all gallery images
 * @route   GET /api/admin/gallery
 * @access  Private/Admin
 */
const getAllImages = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    const images = await Gallery.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error("Error in getAllImages:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete an image from gallery and cloudinary
 * @route   DELETE /api/admin/gallery/:id
 * @access  Private/Admin
 */
const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Delete image from Cloudinary
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Toggle image status (active/inactive)
 * @route   PATCH /api/admin/gallery/:id/status
 * @access  Private/Admin
 */
const toggleImageStatus = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    image.isActive = !image.isActive;
    await image.save();

    res.status(200).json({
      success: true,
      message: `Image ${image.isActive ? "activated" : "deactivated"} successfully`,
      data: image,
    });
  } catch (error) {
    console.error("Error in toggleImageStatus:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  deleteImage,
  toggleImageStatus,
};
