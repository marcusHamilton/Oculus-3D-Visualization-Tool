/*
 *This file i sresponsible for all things javascript that happen on the dashboard page
 */


function packID(id) {
    sessionStorage.setItem('selectedID', JSON.stringify(id));
}

function deleteWorld(id) {
    var worldURL = '/worlds/' + id;
    $.ajax({
        type: "DELETE",
        url: worldURL,
    });
    reloadWorlds();
}

function addCollab(userID) {

}

//Needs to be refactored for realtime database. This is not efficient
function reloadWorlds() {
    var myNode = document.getElementById("worldContainer");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    document.getElementById('spinningLoader').style = "display:block";
    var allKeys;
    $.ajax({
        type: "GET",
        url: '/worlds',
        success: function (response) {
            document.getElementById('spinningLoader').style = "display:none";
            allKeys = response;
            for (var i = 0; i < allKeys.length; i++) {
                $('#worldContainer').append('  <div class="btn-group"><a href="/VRWorld" onClick="packID(this.id)" type="button" class="btn btn-primary" id="' + allKeys[i] + '">' + "World" + i + '</a><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button><ul class="dropdown-menu worldOptions" role="menu"><li><a href="#" data-toggle="modal" data-target="#addUser-modal" id="' + allKeys[i] + '" onClick="addUserHelper(this.id)">Add User</a></li><li><a href="#" onClick="deleteWorld(this.id)" id="' + allKeys[i] + '">Delete</a></li></ul></div>');
            }
        }
    });
}

function addUserHelper(WorldID)
{
    document.getElementById('worldIDInputBox').value=WorldID;
}

function addUser()
{
    //regex to check that the email is a gmail account
    var reg = new RegExp("^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$");
    if(document.getElementById('addEmail').value == "")
    {
        document.getElementById('badEmailMessage').style="display:none";
        document.getElementById('noEmailMessage').style="display:block";
    }
    else if(!reg.test(document.getElementById('addEmail').value))
    {
        document.getElementById('noEmailMessage').style="display:none";
        document.getElementById('badEmailMessage').style="display:block";
    }
    else
    {
        var email = document.getElementById('addEmail').value;
        var worldID = document.getElementById('worldIDInputBox').value;
        console.log("Adding email: " + email + " to world: " + worldID);

        //Do stuff with email and worldID here

        //Reset the modal box for more use
        $('#addUser-modal').modal('hide');
        document.getElementById('noEmailMessage').style="display:none";
        document.getElementById('badEmailMessage').style="display:none";
        document.getElementById('addEmail').value = "";
        document.getElementById('worldIDInputBox').value = "";
    }
}


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