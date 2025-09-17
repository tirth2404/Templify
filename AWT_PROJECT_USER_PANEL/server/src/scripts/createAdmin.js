require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tempify';

async function main() {
	try {
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connected to MongoDB');

		const email = 'admin@gmail.com';
		const password = 'admin123'; // must be >= 6 chars per schema

		let admin = await User.findOne({ email });
		if (admin) {
			console.log('Admin already exists. Updating password and role...');
			admin.passwordHash = password; // will be hashed by pre-save
			admin.role = 'admin';
			admin.companyName = admin.companyName || 'Admin';
			admin.mobile = admin.mobile || '+10000000000';
			admin.address = admin.address || 'Admin Address';
			await admin.save();
		} else {
			admin = new User({
				companyName: 'Admin',
				email,
				passwordHash: password, // will be hashed by pre-save
				mobile: '+10000000000',
				address: 'Admin Address',
				role: 'admin'
			});
			await admin.save();
		}

		console.log('✅ Admin ready:');
		console.log(`Email: ${email}`);
		console.log(`Password: ${password}`);
	} catch (err) {
		console.error('Failed to create admin:', err);
		process.exitCode = 1;
	} finally {
		await mongoose.connection.close();
		console.log('Closed MongoDB connection');
	}
}

if (require.main === module) {
	main();
}

module.exports = main;


