/**
 * Populates the database with test data.
 * When a new model is created, import it under the 'Import models' comment,
 * then add a new conditional in the seedDatabase arrow function under 
 * the 'Add test data to tables' comment.
 */

const sequelize = require("./config/database");
const fs = require("fs");
const path = require("path");
const UserModel = require("./models/User");
const IssueModel = require("./models/Issue");
const EquipmentModel = require("./models/Equipment");
const BookingModel = require("./models/Booking");
const RequestModel = require("./models/Request");

// Import models
const User = UserModel(sequelize);
const Issue = IssueModel(sequelize);
const Equipment = EquipmentModel(sequelize);
const Booking = BookingModel(sequelize);
const Request = RequestModel(sequelize);

// Sync the database and seed data
// Set the clear = true to erase existing data from your database
const seedDatabase = async (clear = true) => {
    try {
        if (clear) {
            // Clear existing data
            await sequelize.sync({force: true});
        } 
        else {
            // Create tables if they don't exist
            await sequelize.sync();
        }

        // Add test data to tables
        // Users
        const userCount = await User.count();
        if (userCount === 0) {
            await User.bulkCreate([
                {email: "real_email1@email.com", firstName: "Conner", lastName: "McDavid", userRole: "Premium", password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"}, // SHA-256 Hash of "password"
                {email: "real_email2@email.com", firstName: "Sidney", lastName: "Crosby", userRole: "Basic", password: "c0e21a8ff85153deac82fe7f09c0da1b3bd90ac0ae204e78d7148753b4363c03"}, // SHA-256 Hash of "wordpass"
                {email: "real_email3@email.com", firstName: "Austin", lastName: "Matthews", userRole: "Admin", password: "80d1159c872683756864281692bf8ffa330341cae85c8e188a2bf29edd7adbbe"}, // SHA-256 Hash of "extraSuperStrongP@s$W0Rd!"
            ]);
            console.log("Seeded user table");
        }
        
        // Issues
        const issueCount = await Issue.count();
        if (issueCount === 0) {
            await Issue.bulkCreate([
                {id: 0, equipmentName: "3D Printer", description: "This machine prints things in three dimensions!", dateSubmitted: new Date(), issueStatus: false},
                {id: 1, equipmentName: "Vending machine", description: "Get ur snaks here!!!", dateSubmitted: new Date(), issueStatus: true},
            ]);
            console.log("Seeded issue table");
        }

        // Equipment
        const equipmentCount = await Equipment.count();
        if (equipmentCount === 0) {
            await Equipment.bulkCreate([
                {id: 0, name: "3D Printer", description: "This machine prints things in three dimensions!", icon: fs.readFileSync(path.join(__dirname, "icons", "3d_printer.png")), equipmentStatus: "good", isBookable: true, isPremium: true},
                {id: 1, name: "Stapler", description: "Staples stuff", icon: fs.readFileSync(path.join(__dirname, "icons", "stapler.png")), equipmentStatus: "really good", isBookable: false, isPremium: false},
            ]);
            console.log("Seeded equipment table");
        }

        // Bookings
        const bookingCount = await Booking.count();
        if (bookingCount === 0) {
            await Booking.bulkCreate([
                {id: 0, userEmail: "real_email1@gmail.com", equipmentID: 0, bookingDateTime: new Date(), bookingDuration: 3},
                {id: 1, userEmail: "real_email2@gmail.com", equipmentID: 1, bookingDateTime: new Date(), bookingDuration: 2},
            ]);
            console.log("Seeded booking table");
        }

        // Requests
        const requestCount = await Request.count();
        if (requestCount === 0) {
            await Request.bulkCreate([
                {id: 0, userEmail: "real_email1@email.com", description: "Gimme that machine", status: "approved"},
                {id: 1, userEmail: "real_email2@email.com", description: "I likes it and I wants it", status: 'pending'},
            ]);
            console.log("Seeded request table");
        }
    } 
    catch (error) {
        console.error("Error seeding database:", error);
    }
};

module.exports = seedDatabase;
