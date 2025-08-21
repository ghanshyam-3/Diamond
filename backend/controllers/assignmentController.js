const Assignment = require('../models/Assignment');
const Diamond = require('../models/Diamond');

// Approve diamond (Owner)
exports.approveDiamond = async (req, res) => {
  try {
    const diamond = await Diamond.findByIdAndUpdate(req.params.id, { status: 'approved_for_polish' }, { new: true });
    res.json(diamond);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign diamond to employee
exports.assignDiamond = async (req, res) => {
  try {
    const { employee, price_per_polish, diamond } = req.body;

    // update diamond status to assigned
    await Diamond.findByIdAndUpdate(diamond, { status: 'assigned' });

    const assignment = await Assignment.create({
      diamond,
      employee,
      price_per_polish
    });

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get assignments for logged-in employee
exports.getEmployeeAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ employee: req.user._id })
      .populate('diamond')
      .populate('employee', 'name');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignments created by manager (all assignments)
exports.getManagerAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('diamond')
      .populate('employee', 'name');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee marks polish as completed
exports.completeAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    ).populate('diamond');
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manager verifies and marks diamond as polished
exports.verifyAndMarkPolished = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('diamond');
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    if (assignment.status !== 'completed') {
      return res.status(400).json({ message: 'Assignment is not completed yet' });
    }

    // Update diamond status to polished and get updated diamond
    const updatedDiamond = await Diamond.findByIdAndUpdate(
      assignment.diamond._id,
      { status: 'polished' },
      { new: true }
    );

    // Get the updated assignment with the new diamond data
    const updatedAssignment = await Assignment.findById(req.params.id)
      .populate({
        path: 'diamond',
        select: 'unique_id status price_per_polish'
      })
      .populate('employee', 'name');

    res.json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee current month earnings
exports.getCurrentMonthEarnings = async (req, res) => {
  try {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const assignments = await Assignment.find({
      employee: req.user._id,
      status: 'completed',
      updatedAt: { $gte: start, $lte: end }
    });

    const total = assignments.reduce((acc, a) => acc + a.price_per_polish, 0);

    res.json({ month: start.toLocaleString('default', { month: 'long' }), total, count: assignments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Employee earnings history (monthly)
exports.getEarningsHistory = async (req, res) => {
  try {
    const history = await Assignment.aggregate([
      { $match: { employee: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' } },
          total: { $sum: '$price_per_polish' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Manager → all employees earnings
exports.getAllEmployeesEarnings = async (req, res) => {
  try {
    const data = await Assignment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$employee',
          totalEarning: { $sum: '$price_per_polish' },
          completedWorks: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
