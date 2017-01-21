/**
 * Created by Boaz on 19/01/2017.
 */
const readlineSync = require('readline-sync');
var exit = false;//global variable to control the exit command
var uniqueID = 0;// an ID of each file in the storage
var path = 'root >';
var level = 0;// level distance from root folder

var storage = [//basic folder system
    /*[id, parentID , whatAmI?, content===NULL]*/
    [0,0,'root(i\'m the son of myself)'],
    [1,0,'subfolder1'],
    [2,0,'subfolder2'],
    [3,0,'subfolder3'],
    [4,1,'subfolder4'],
    [5,4,'subfolder5' ],
    [6,5,'file1.txt','content'],
    [7,5,'file2.txt','content'],
    [8,0, 'test.txt', 'hello world']
];


var menu = [//user menu
    ' Print Current folder.',
    ' Change(go back or forward) ',
    ' Create file or folder',
    ' Open file',
    ' Delete file',
    ' Exit(suit yourself out from the program)'
];

    console.log(path);
while (!exit){

        showMenu();
}

            function showMenu() {
                var userMenuInput = readlineSync.keyInSelect(menu, 'Chose your menu option(1 to 6):');
                userMenuInput++;
                switch (userMenuInput){//calling functions according to user menu input
                    case 1 :
                        printRootSorted();
                        break;
                    case 2 :
                        changeDirectory();

                        break;
                    case 3 :
                        createNewFile();
                        break;
                    case 4 :
                        openFile();
                        break;
                    case 5 :
                        deleteFile();
                        break;
                    case 6 :
                        exitProgram();
                        break;

                    default:
                        console.log("What is wrong with you?? chose menu item between 1 to 6");

                }
            }

            function exitProgram() {// exit the program safely using the process object
                var exitProgram = readlineSync.question("Are you sure you want to exit? (y / n)");
                if(exitProgram.toLowerCase() === 'y'){
                    exit = true;
                    process.exit();
                }else if(exitProgram.toLowerCase() === 'n' ){
                    showMenu();
                }
            }



            function printRootSorted(){// print the first level sons under folder sorted way
                console.log(path);
                var foldersArr = [];
                var filesArr = [];
                for(var i = 1; i <storage.length; i++){
                    if( uniqueID === storage[i][1])
                    {
                        if (isFolder(i) ) {
                            foldersArr.push(storage[i][2]);
                        } else  {
                            filesArr.push(storage[i][2]);
                        }
                    }

                }
                foldersArr.sort();
                filesArr.sort();
                for(var j = 0; j<foldersArr.length ; j++){
                    console.log(" " +foldersArr[j]);
                }

                for(var k = 0; k<filesArr.length ; k++){
                    console.log("    " +filesArr[k]);
                }

                console.log("number of files: " + (filesArr.length+foldersArr.length)+".");



            }

            function changeDirectory(){// move backward or forward from current directory
                var goTo = readlineSync.question("Where would you like to go?()");
                if(goTo === '..'){//backward case
                    if(uniqueID > 0){
                        uniqueID = storage[uniqueID][1];
                        var name =  storage[uniqueID][2];
                        path = path.slice(0,(path.length-name.length));
                        console.log(path);
                        level--;

                    }else{// edge case of root folder
                        console.log("You are in the root , no where to go back");
                    }
                }else if(!checkIfFolderExist(goTo)) {
                    console.log("No directory called " + goTo);
                }

            }

            function checkIfFolderExist(folderName) {//help function in order to check whether user input of folder is exist
                for(var i = 0 ; i < storage.length ; i++){
                   if(folderName === storage[i][2] && uniqueID === storage[i][1]){
                       path += "/" + folderName;
                       uniqueID = storage[i][0] ;
                       level++;
                       console.log(path);
                       return true;
                   }
                }
                return false;
            }

            function isFolder(id){// check if the needed to open is file or folder, (help function)

                if(storage[id].length === 3){
                    return true;
                }
                return false;
            }

            function openFile(){// show content of a file if exist
                var file = readlineSync.question("Which file would you like to open?");
                file = file.toLowerCase();
                if (isExist(file) ){
                    if(isFolder(getIndex(file))){
                        console.log("File not to be found");
                    }else{
                        console.log(storage[getIndex(file)][3]);
                    }
                }else {
                    console.log("File not to be found.");
                }
            }


            function isExist(name) {
                for(var i = 0 ; i < storage.length ; i++){
                    if(name === storage[i][2] && uniqueID === storage[i][1]){
                        return true;
                    }
                }
                return false;
            }

            function getIndex(name) {//return the uniqueID of specific file
                for(var i = 0 ; i < storage.length ; i++){
                    if(name === storage[i][2] && uniqueID === storage[i][1]){
                       return storage[i][0];
                    }
                }
                return -1;
            }

            function createNewFile(){
                var fileToCreate = readlineSync.question("Please name the file you want to create:");
                fileToCreate = fileToCreate.toLowerCase();
                if(!isExist(fileToCreate)){
                    if(fileToCreate.indexOf(".") > -1){
                        var content = readlineSync.question("what content would you like to enter to your file?");
                        storage.push([storage.length, uniqueID, fileToCreate, content]);
                    }else {
                        storage.push([storage.length, uniqueID, fileToCreate]);
                    }
                }else{
                    console.log(fileToCreate +" is already exist under the current folder.")
                }
            }

            function deleteFile(){
                var fileToDelete = readlineSync.question("Which file would you like to delete?");
                fileToDelete = fileToDelete.toLowerCase();
                if(isExist(fileToDelete)){
                  deleteId(getIndex(fileToDelete));
                }else {
                    console.log(fileToDelete + " dosen't exit under the current folder");
                }
            }

            function deleteId(id) {
                if(!isFolder(id)){                        // File to delete
                    console.log(storage[id][2] + " deleted.");
                    storage.splice(id, 1);
                }else{                                                        // Folder to delete
                    //
                    var stackToDelete = [];//stack that will hold all files need to be deleted
                    for(var i = 1; i <storage.length; i++){
                        if (id === storage[i][1]){
                            stackToDelete.push(storage[i][0]);
                        }
                    }

                    if(stackToDelete.length === 0){
                        console.log(storage[id][2] + " deleted.");
                        storage.splice(id, 1);
                    }else {

                        while (stackToDelete.length > 0){

                            deleteId(stackToDelete.pop()); //recursion call with the id on top of stack
                        }
                        console.log(storage[id][2] + " deleted.");
                        storage.splice(id, 1);
                    }


                }
            }




