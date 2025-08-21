const User = require('../models/User');
const Assignment = require('../models/Assignment');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (for owner)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized. Owner access only.' });
    }
    
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user details with performance metrics
exports.getUserDetails = async (req, res) => {
  try {
    // Check if user is owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized. Owner access only.' });
    }
    
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get assignments statistics with more details
    const assignments = await Assignment.find({ assignedTo: userId }).populate('diamond');
    const completedAssignments = assignments.filter(a => a.status === 'completed');
    const inProgressAssignments = assignments.filter(a => a.status === 'in_progress');
    const totalAssignments = assignments.length;

    // Calculate total carat value
    const totalCarats = assignments.reduce((sum, a) => sum + (a.diamond?.carat || 0), 0);
    const completedCarats = completedAssignments.reduce((sum, a) => sum + (a.diamond?.carat || 0), 0);
    
    res.json({
      user,
      statistics: {
        totalAssignments,
        completedAssignments: completedAssignments.length,
        inProgressAssignments: inProgressAssignments.length,
        completionRate: totalAssignments ? (completedAssignments.length / totalAssignments) * 100 : 0,
        totalCaratsHandled: totalCarats.toFixed(2),
        completedCarats: completedCarats.toFixed(2),
        recentAssignments: assignments.slice(-5).map(a => ({
          diamondId: a.diamond?.id || 'N/A',
          status: a.status,
          carat: a.diamond?.carat || 0,
          assignedDate: a.createdAt
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    // Check if user is owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized. Owner access only.' });
    }
    
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is owner
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Not authorized. Owner access only.' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete all assignments associated with this user
    await Assignment.deleteMany({ assignedTo: req.params.id });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
