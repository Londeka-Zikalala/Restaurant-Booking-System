const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
        try {
            let availableTable = await db.any('SELECT * FROM table_booking WHERE booked = $1', false);
            return availableTable;
        } catch (error) {
            // Handle the errors
            console.error('Error getting tables', error);
            throw error
        }
    }

    async function bookTable(tableName) {
        // book a table by name
    }
    //update the table booking 
    async function editTableBooking(tableName){

    }

    async function getBookedTables() {
        // get all the booked tables
    }

    async function isTableBooked(tableName) {
        // get booked table by name
    }

    async function cancelTableBooking(tableName) {
        // cancel a table by name
    }

    async function getBookedTablesForUser(username) {
        // get user table booking
    }


    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        editTableBooking,
        getBookedTablesForUser
    }
}

export default restaurant;