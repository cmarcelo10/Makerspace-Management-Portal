/**
 * Populates the database with test data.
 * When a new model is created, import it under the 'Import models' comment,
 * then add a new conditional in the seedDatabase arrow function under 
 * the 'Add test data to tables' comment.
 */

const { DataTypes, DATE } = require("sequelize");
const sequelize = require("./config/database");
const UserModel = require("./models/User");
const IssueModel = require("./models/Issue");
const EquipmentModel = require("./models/Equipment");
const fs = require("fs");
const path = require("path");

// Import models
const User = UserModel(sequelize);
const Issue = IssueModel(sequelize);
const Equipment = EquipmentModel(sequelize);

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
        const userCount = await User.count();
        if (userCount === 0) {
            await User.bulkCreate([
                {email: "real_email1@email.com", firstName: "Conner", lastName: "McDavid", userRole: "Premium", password: "passwordpasswordpasswordpasswordpasswordpasswordpasswordpassword"},
                {email: "real_email2@email.com", firstName: "Sidney", lastName: "Crosby", userRole: "Basic", password: "passwordpasswordpasswordpasswordpasswordpasswordpasswordpassword"},
                {email: "real_email3@email.com", firstName: "Austin", lastName: "Matthews", userRole: "Premium", password: "passwordpasswordpasswordpasswordpasswordpasswordpasswordpassword"},
            ]);
            console.log("Seeded user table");
        }

        const issueCount = await Issue.count();
        if (issueCount === 0) {
            await Issue.bulkCreate([
                {id: 0, equipmentName: "3D Printer", description: "This machine prints things in three dimensions!", dateSubmitted: new Date(), issueStatus: false},
                {id: 1, equipmentName: "Vending machine", description: "Get ur snaks here!!!", dateSubmitted: new Date(), issueStatus: true},
            ]);
            console.log("Seeded issue table");
        }

        const equipmentCount = await Equipment.count();
        if (equipmentCount === 0) {
            await Equipment.bulkCreate([
                {id: 0, name: "3D Printer", description: "This machine prints things in three dimensions!", icon: fs.readFileSync(path.join(__dirname, "icons", "3d_printer.png")), equipmentStatus: "good", isBookable: true, isPremium: true},
                {id: 1, name: "Stapler", description: "Staples stuff", icon: fs.readFileSync(path.join(__dirname, "icons", "stapler.png")), equipmentStatus: "really good", isBookable: false, isPremium: false},
            ]);
            console.log("Seeded equipment table");
        } 
    } 
    catch (error) {
        console.error("Error seeding database:", error);
    }
};

module.exports = seedDatabase;
