const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userManager = require('../data/managers/users');
const preferenceManager = require('../data/managers/preferences')
const { fetchNewsByPreferences } = require('../services/newsService')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports.createProfile = async (req, res) => {
    try {
        const params = req.body.payload || {};

        const requiredFields = ['email', 'password', 'fullName', 'phone'];
        for (let field of requiredFields) {
            if (!params[field]) {
                return res.status(400).json({ success: false, message: `Missing field: ${field}` });
            }
        }

        const existingProfile = await userManager.getUserDetails({ email: params.email });
        if (existingProfile) {
            return res.status(409).json({ success: false, message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(params.password, 10);
        const payload = {
            email: params.email,
            password: hashedPassword,
            fullName: params.fullName,
            phone: params.phone,
        };

        await userManager.createProfile(payload);
        return res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error('Error creating user profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to register user' });
    }
};

module.exports.login = async (req, res) => {
    try {
        const params = req.body.payload || {};

        if (!params.email || !params.password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await userManager.getUserDetails({ email: params.email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(params.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const { password, ...userData } = user;
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Error during user login:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to validate user.' });
    }
};

module.exports.createPreference = async (req, res) => {
    try {
        const params = req.body.payload
        if(!params) return res.status(401).json({ message: 'Request payload missing.' })
        const existing = await preferenceManager.getUserPreferences({ userId: req.user.id });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Preferences already exist for this user.' });
        }
        let payload = {
            userId: req.user.id,
            categories: params.categories || [],
            languages: params.languages || [],
            region: params.region || '',
            sources: params.sources || []
        }
        await preferenceManager.createUserPreferences(payload)
        return res.status(200).json({ success: true , message: 'Preference updated successfully.' })
    } catch (error) {
        console.error('Error during preference creation:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to create preference.' });
    }
};

module.exports.getPreferences = async (req, res) => {
    try {
        const id = req.user.id
        const searchQuery = {
            userId: id
        }

        const preferences = await preferenceManager.getUserPreferences(searchQuery)
        return res.status(200).json({ success: true , data : preferences })
    } catch (error) {
        console.error('Error during fetching preference:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch preference.' });
    }
};

module.exports.updatePreferences = async (req, res) => {
    try {
        const id = req.user.id
        const params = req.body.payload
        const searchQuery = {
            userId: id
        }

        const prefData = await preferenceManager.getUserPreferences(searchQuery)
        if(!prefData) return res.status(200).json({ success: true, message: 'No Preferences found1.' })

        let payload = {
            userId: req.user.id,
            categories: params.categories || [],
            languages: params.languages || [],
            region: params.region || '',
            sources: params.sources || []
        }
        const data = await preferenceManager.updateUserPreferences( searchQuery, payload )
        return res.status(200).json({ success: true , message: 'Preference updated successfully', data })
    } catch (error) {
        console.error('Error during preference update:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to update preference.' });
    }
};

module.exports.getNewsByPreferences = async (req, res) => {
    try {
        const id = req.user.id
        const searchQuery = {
            userId: id
        }

        const preferences = await preferenceManager.getUserPreferences(searchQuery)
        const articles = await fetchNewsByPreferences(preferences);
        return res.status(200).json({ success: true , data : articles })
    } catch (error) {
        console.error('Error during fetching preference:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch preference.' });
    }
};
