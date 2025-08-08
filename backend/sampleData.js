/*
 * Sample data to seed the Motorado database.  Use this script as a guide
 * when populating your MongoDB instance with initial data.  To import
 * data into MongoDB you can write a small seeding script or use a
 * database GUI such as MongoDB Compass.
 */

module.exports = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@motorado.ae',
      password: 'password123',
      role: 'admin',
      sellerType: 'dealer',
      phoneNumber: '+971501234567',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'seller',
      sellerType: 'individual',
      phoneNumber: '+971501234568',
    },
  ],
  listings: [
    {
      title: 'Toyota Corolla 2018',
      make: 'Toyota',
      model: 'Corolla',
      year: 2018,
      price: 42000,
      mileage: 65000,
      engine: '1.6L',
      transmission: 'Automatic',
      color: 'White',
      bodyType: 'Sedan',
      location: 'Dubai',
      description: 'Well maintained, single owner, accident free.',
      sellerType: 'individual',
      images: [],
      status: 'Approved',
    },
    {
      title: 'Nissan Patrol 2020',
      make: 'Nissan',
      model: 'Patrol',
      year: 2020,
      price: 220000,
      mileage: 15000,
      engine: '5.6L',
      transmission: 'Automatic',
      color: 'Black',
      bodyType: 'SUV',
      location: 'Abu Dhabi',
      description: 'Dealer warranty, full service history.',
      sellerType: 'dealer',
      images: [],
      status: 'Approved',
    },
  ],
};