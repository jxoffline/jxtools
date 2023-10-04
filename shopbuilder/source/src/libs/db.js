
let db;

const thisLib = {
    
    init: () => {
        db = new Dexie("FriendDatabase");
        db.version(2).stores({
            files: "&fName,fContent"
        });
    },

    save: async(fileName, fileContent) => {
        console.log(fileName, fileContent);
        try {
            // Check if a record with the given file name exists
            const existingFile = await db.files.get({ fName: fileName });
        
            if (existingFile) {
              // If the record exists, update it
              await db.files.update(fileName, { fContent: fileContent });
              console.log(`Updated record for ${fileName}`);
            } else {
              // If the record doesn't exist, create a new one
              await db.files.add({ fName: fileName, fContent: fileContent });
              console.log(`Created record for ${fileName}`);
            }
          } catch (error) {
            console.error(`Error updating/creating record: ${error}`);
          }
    },

    get: async(fileName) => {
        try {
          const file = await db.files.get({ fName: fileName });
          if (file) {
            return file.fContent;
          } else {
            console.log(`File with name '${fileName}' not found.`);
            return null;
          }
        } catch (error) {
          console.error(`Error retrieving content: ${error}`);
          return null;
        }
    },
    remove: async(fileName) => {
        try {
          const file = await db.files.get({ fName: fileName });
          if (file) {
            await db.files.delete(fileName);
            console.log(`Deleted record with file name '${fileName}'.`);
          } else {
            console.log(`File with name '${fileName}' not found. No records deleted.`);
          }
        } catch (error) {
          console.error(`Error deleting record: ${error}`);
        }
    },

    getAll: async() => {
      try {
        const allFiles = await db.files.toArray();
        return allFiles;
      } catch (error) {
        console.error(`Error retrieving all files: ${error}`);
        return [];
      }
    }
      

}
export default thisLib;