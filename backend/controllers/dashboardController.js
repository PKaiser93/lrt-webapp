const Computer = require('../models/Computer');
const Betriebssystem = require('../models/Betriebssystem');

exports.getAdminDashboard = async (req, res) => {
    try {
        const total = await Computer.countDocuments({ deleted: false });

        const topOS = await Computer.aggregate([
            { $match: { deleted: false } },
            { $group: { _id: '$betriebssystem', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'betriebssystems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'osInfo'
                }
            },
            { $unwind: '$osInfo' },
            {
                $project: {
                    name: '$osInfo.name',
                    count: 1
                }
            }
        ]);

        const yearChart = await Computer.aggregate([
            { $match: { deleted: false } },
            { $group: { _id: '$beschaffungsjahr', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({ total, topOS, yearChart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
