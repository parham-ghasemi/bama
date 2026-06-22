const cron = require('node-cron');
const moment = require('moment-jalaali');
const Villa = require('./models/Villa');
const Reservation = require('./models/Reservation');

cron.schedule('0 0 * * *', async () => { // Run daily at midnight
  try {
    const now = new Date();
    const deletedVillas = await Villa.deleteMany({
      status: 'rejected',
      deletionDate: { $lte: now }
    });
    console.log(`Deleted ${deletedVillas.deletedCount} rejected villas.`);
  } catch (error) {
    console.error('Error in cron job for villas:', error);
  }
});

cron.schedule('0 0 * * *', async () => { // Run daily at midnight to clean past reservations from reserved array
  try {
    const current = moment().format('jYYYY/jMM/jDD');
    const villas = await Villa.find({ reserved: { $exists: true, $ne: [] } });
    for (let villa of villas) {
      const reservations = await Reservation.find({ _id: { $in: villa.reserved } });
      const futureIds = reservations
        .filter(resv => resv.until >= current)
        .map(resv => resv._id);
      if (futureIds.length < villa.reserved.length) {
        villa.reserved = futureIds;
        await villa.save();
      }
    }
    console.log('Cleaned past reservations from villas.');
  } catch (error) {
    console.error('Error in cron job for reservations:', error);
  }
});