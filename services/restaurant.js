const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
        try {
            let availableTable = await db.any('SELECT * FROM public.table_booking WHERE booked = $1', false);
            return availableTable;
        } catch (error) {
            // Handle the errors
            console.error('Error getting tables', error);
            throw error
        }
    }

    async function bookTable(bookingDetails) {
    
       const{
            tableName,username,seats, phoneNumber
        } = bookingDetails;
        // book a table by name
        try{
            let availableTable = await db.oneOrNone('SELECT * FROM table_booking WHERE table_name = $1 AND booked = $2',[tableName, false]);
            //check if the table is available and the people fit the capacity
            if(availableTable && seats <= availableTable.capacity && username !== null && phoneNumber !== null){
                //book the table
                await db.none('UPDATE public.table_booking SET booked = $1, username = $2, number_of_people =$3, contact_number = $4 WHERE table_name =$5', [true,username,seats,phoneNumber,tableName])

            }
        }
        catch(error){
            console.error('Error booking table', error)
            throw error
        }
    }
       
    //update the table booking 
    async function editTableBooking(tableName){

    }

    async function getBookedTables() {
        // get all the tables where booked = true
        try{
          let bookedTable =  await db.any('SELECT * FROM public.table_booking WHERE booked = $1', true)
          return bookedTable;
        }
        catch(error){
            console.error('Error fetching tables', error)
            throw error
        }

    }

    async function isTableBooked(tableName) {
        // get booked table by name
        //check if booked = true
        try{
            let bookedTable =  await db.any('SELECT * FROM public.table_booking WHERE booked = $1  AND table_name = $2',[true, tableName]);
            if(bookedTable){
                return true;
                
            }else{
                return false
            }
           
          }
          catch(error){
              console.error('Error fetching tables', error)
              throw error
          }
  
    }

    async function cancelTableBooking(tableName) {
        // cancel a table by name
        try{
            //get the bookked table
            await db.oneOrNone('SELECT * FROM public.table_booking WHERE table_name = $1 AND booked = $2',[tableName, true])
            //update the table
            await db.none('UPDATE table_booking SET booked=$1, username = $2, number_of_people = $3, contact_number =$4 WHERE table_name = $5',[false,null,null,null,tableName])

        }
        catch(error){
            console.error('Error updating tables', error)
            throw error
        }
        
    }

    async function getBookedTablesForUser(username) {
        // get user table booking
        try {
            //get booked tables using the username
            let bookedTables = await db.any('SELECT * FROM table_booking WHERE username = $1 AND booked = $2', [username, true]);
            return bookedTables;
        } catch (error) {
            console.error('Error getting booked tables for user', error);
            throw error;
        }
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