const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath, folder = 'tempify', options = {}) => {
	const uploadOptions = {
		folder,
		use_filename: true,
		unique_filename: true,
		overwrite: false,
		resource_type: 'auto',
		...options
	};

	try {
		const result = await cloudinary.uploader.upload(filePath, uploadOptions);
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
		return result;
	} catch (error) {
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
		throw error;
	}
};

const deleteFromCloudinary = async (publicId) => {
	return cloudinary.uploader.destroy(publicId);
};

const isCloudinaryConfigured = () => {
	return !!(
		process.env.CLOUDINARY_CLOUD_NAME &&
		process.env.CLOUDINARY_API_KEY &&
		process.env.CLOUDINARY_API_SECRET
	);
};

module.exports = {
	cloudinary,
	uploadToCloudinary,
	deleteFromCloudinary,
	isCloudinaryConfigured
};


