/*
 *This file is sresponsible for all things javascript that happen on the dashboard page
 */

function packID(id) {
    sessionStorage.setItem('selectedID', JSON.stringify(id));
}

function addUserHelper(WorldID) {
    document.getElementById('worldIDInputBox').value = WorldID;
}

function addUser() {
    //regex to check that the email is a gmail account
    var reg = new RegExp("^[\\w.+\\-]+@gmail\\.com$");
    if (document.getElementById('addEmail').value == "") {
        document.getElementById('badEmailMessage').style = "display:none";
        document.getElementById('noEmailMessage').style = "display:block";
    } else if (!reg.test(document.getElementById('addEmail').value)) {
        document.getElementById('noEmailMessage').style = "display:none";
        document.getElementById('badEmailMessage').style = "display:block";
    } else {
        var email = document.getElementById('addEmail').value;
        var worldID = document.getElementById('worldIDInputBox').value;
        console.log("Adding email: " + email + " to world: " + worldID);

        //attempt to add the collaborator with their given email at the specified worldID
        addCollab(email, worldID);

        //Reset the modal box for more use
        $('#addUser-modal').modal('hide');
        document.getElementById('noEmailMessage').style = "display:none";
        document.getElementById('badEmailMessage').style = "display:none";
        document.getElementById('addEmail').value = "";
        document.getElementById('worldIDInputBox').value = "";
    }
}

//Function is waiting for a modal close with class myModal and clears its fields so
//it may be used again
$(function () {
    // when the modal is closed
    $('#myModal').on('hidden.bs.modal', function () {

        //location.reload();
    });
});

//Function is waiting for a modal close with class addUser-modal and clears its fields so
//it may be used again
$(function () {
    // when the modal is closed
    $('#addUser-modal').on('hidden.bs.modal', function () {
        document.getElementById('noEmailMessage').style = "display:none";
        document.getElementById('badEmailMessage').style = "display:none";
        document.getElementById('addEmail').value = "";
        document.getElementById('worldIDInputBox').value = "";
    });
});

//Function is used to display the name of the file uploaded in the box
//on the modal box that helps the user load in a local file
$(function () {

    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    // We can watch for our custom `fileselect` event like this
    $(document).ready(function () {
        $(':file').on('fileselect', function (event, numFiles, label) {

            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

            if (input.length) {
                input.val(log);
            } else {
                if (log) alert(log);
            }

        });
    });

});