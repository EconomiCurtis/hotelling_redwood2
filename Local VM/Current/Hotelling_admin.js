Redwood.controller("AdminCtrl", ["$rootScope", "$scope", "Admin", function($rootScope, $scope, ra) {
    var new_period = 2;
    var group_size = 2;
    var silo_size = 1;
    var silos = [ //array of silos. must be coherent with groups
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    var subject_count = 0;
    var per_period_subject_counter = {};
    var subjs = [];
    var groups = []; //array of groups. must be coherent with silos
    $('#current_silo').html('<small>Current Silo Size: ' + silo_size + '</small>');
    $('#current_group').html('<small>Current Group Size: ' + group_size + '</small>');

    var Display = {}; //display controller
    Display.initialize = function() {

        $("#start-session").click(function() {
            $("#start-session").attr("disabled", "disabled");
            ra.trigger("start_session");
        });

        ra.on("start_session", function() {
            $("#start-session").attr("disabled", "disabled");
            $("#pause-session").removeAttr("disabled");
        });

        $("#refresh-subjects").click(function() {
            $("#refresh-subjects").attr("disabled", "disabled");
            ra.refreshSubjects().then(function() {
                $("#refresh-subjects").removeAttr("disabled");
            });
        });

        $("#reset-session").click(function() {
            ra.reset();
        });

        $("#pause-session").click(function() {
            $("#pause-session").attr("disabled", "disabled");
            ra.trigger("pause");
        });
        ra.on("pause", function() {
            $("#pause-session").attr("disabled", "disabled");
        });

        $("#resume-session").click(function() {
            $("#resume-session").attr("disabled", "disabled");
            ra.trigger("resume");
        });
        ra.on("resume", function() {
            $("#resume-session").attr("disabled", "disabled");
            $("#pause-session").removeAttr("disabled");
        });

        ra.on_subject_paused(function(userId) {
            $("#pause-session").attr("disabled", "disabled");
            $("tr.subject-" + userId).addClass("warning"); //Display current period for each user
            $("tr.subject-" + userId + " :nth-child(4)").text("Paused"); //Display current period for each user
        });

        ra.on_all_paused(function() {
            $("#resume-session").removeAttr("disabled");
        });

        ra.on_subject_resumed(function(user) {
            $("tr.subject-" + user).removeClass("warning"); //Display current period for each user
            $("tr.subject-" + user + " :nth-child(4)").text(""); //Display current period for each user
        });

        $("#archive").click(function() {
            var r = confirm("Are you sure you want to archive this session?");
            if (r == true) {
                ra.delete_session();
            }
        });

        ra.on_router_connected(function(connected) { //Display router connection status
  				var status = $("#router-status");
  				if (connected) {
  					status.text("Router Connected");
  					status.removeClass("alert-danger");
  					status.addClass("alert-success");
  				} else {
  					status.text("Router Disconnected");
  					status.removeClass("alert-success");
  					status.addClass("alert-danger");
  				}
  			});

        ra.on_set_period(function(user, period) {
            $("tr.subject-" + user + " :nth-child(3)").text(period); //Display current period for each user
        });

        ra.on_set_group(function(user, group) {
            $("tr.subject-" + user + " :nth-child(2)").text(group); //Display group for each user
        });

        ra.on_register(function(user) { //Add a row to the table to each user
            $("#subject-list").empty();
            for (var i = 0, l = ra.subjects.length; i < l; i++) {
                $("#subject-list").append($("<tr>").addClass("subject-" + ra.subjects[i].user_id).append(
                    $("<td>").text(ra.subjects[i].user_id).after(
                        $("<td>").text(0).after(
                            $("<td>").text(0).after(
                                $("<td>").text(""))))));
            }
        });



        $("#set_period").click(function() {
            if (new_period !== 0 && new_period !== undefined && new_period !== null && ra.subjects.length > 0) {
                for (var i = 0, l = ra.subjects.length; i < l; i++) {
                    ra.set_period(new_period, ra.subjects[i].user_id);
                }
                ++new_period;
            }
            $("#set_period").html("Start Period: " + new_period);
        });




        $("#set_group_size").click(function() {
            tmp = Number(document.getElementById('group_size').value);

            if (tmp > 0 && tmp !== undefined && tmp !== null && !isNaN(tmp) && (silo_size % tmp == 0)) {
                group_size = tmp;
                ra.trigger("assign_group");
            }
            else {
                alert('Please make sure silo size is a multiple of group size');
            }
            $('#current_group').html('<small>Current Group Size: ' + group_size + '</small>');
        });

        //assigns subjects to new groups within their silo
        ra.on("assign_group", function(msg) {
            console.log("msg", msg);
            setGroups = true;
            subject_count = 0; //we'll count subjects again
            var silosCopy = clone(silos); //we don't want to alter original data of silos
            var groups = [];
            //dedim(silosCopy) flattens the array into 1D array, in effect returning an array of subjects
            console.log("silosCopy", silosCopy);
            console.log("dedim(silosCopy)", dedim(silosCopy));
            console.log("group_size", group_size);
            var numberOfGroups = Math.ceil(dedim(silosCopy).length / group_size); 
            console.log("numberOfGroups", numberOfGroups);
            for (var i = 0; i < numberOfGroups; i++) {
                groups.push([]);
            }
            console.log(groups, "groups");

            //go through array of silos and groups simultaneously (tracked by curr_silo, curr_group)
            //take a random subject from each silo and put it into the group.
            for (var curr_silo = 0, curr_group = 0, l = silosCopy.length; curr_silo < l; curr_silo++) {
                var silo = silosCopy[curr_silo];
                // console.log(groups, "groups");
                var group = groups[curr_group];
                while (silo.length !== 0) {
                    // console.log("curr_silo, curr_group ", curr_silo, curr_group);
                    if (group.length >= group_size) group = groups[++curr_group]; //if group is full, go onto next group
                    var rand = Math.floor(Math.random() * (silo.length)); 
                    var randomSubject = silo.splice(rand, 1)[0];                  //selects one random subject from currrent silo
                    console.log("!msg.current_period", !msg || !msg.current_period);
                    ra.set_group(curr_group + 1, randomSubject.user_id);          //tell server to set subject's group number. if it's before game starts, do the normal protocol. else, only change group number
                    group.push(randomSubject);                                    //push to group. increments group.length
                    subject_count++;
                }
            }
        });


        function custom_set_group(group_id, user_id) {
            ra.sendCustom("custom_set_group", { user_id : user_id , group_id : group_id });

        }



        $("#set_silo_size").click(function() {
            tmp = Number(document.getElementById('silo_size').value);
            if (tmp > 0 && tmp !== undefined && tmp !== null && !isNaN(tmp) && tmp <= ra.subjects.length) {
                silo_size = tmp;
                ra.trigger("assign_silo");
            } else {
                alert('Please make sure the silo size is less than or equal to the number of subjects');
            }
            $('#current_silo').html('<small>Current Silo Size: ' + silo_size + '</small>');
        });
        ra.on("assign_silo", function() {

            tmp = Number(document.getElementById('silo_size').value);

            if (tmp > 0 && tmp !== undefined && tmp !== null && !isNaN(tmp) && tmp <= ra.subjects.length) {
                silo_size = tmp; //already set when pressed the button but let's do it again
            }
            subjs = [];
            silos = [];

            /**
             * collect all subjects into subjs
             * [Simon] Previous version of this code used for .. in loop.
             * for .. in should be avoided in arrays because it also looks at prototype elements
             */
            for (var i = ra.subjects.length - 1; i >= 0; i--) {
                var subj = {};
                subj.user_id = ra.subjects[i].user_id;
                subj.silo = -1;
                subjs.push(subj);
            }

            /**
             * number of subjects should be divisible by silo_size. If not, unpredictable behaviour may occur.
             * create exact number of silos needed (numberOfSilos)
             */
            var numberOfSilos = Math.ceil(subjs.length / silo_size);
            for (var i = 0; i < numberOfSilos; i++) {
                silos.push([]);
            }

            /**
             * go through each silo. while silo is not full and subject available
             * radomly select a subject, remove it from subjs list and push into silo
             * assumes that we have the correct number of silos
             */
            for (var i = silos.length - 1; i >= 0; i--) {
                var silo = silos[i];
                var siloIndex = i + 1;
                while (silo.length !== silo_size && subjs.length !== 0) {
                    var rand = Math.floor(Math.random() * subjs.length);
                    var randomSubject = subjs.splice(rand, 1)[0]; //selects one random subject
                    randomSubject.silo = siloIndex;
                    silo.push(randomSubject);
                }
            }

            console.log('success setting silos. silo_size = ', silo_size);
            console.log("silos ", silos);
        });




        ra.on_set_config(function(config) { //Display the config file
            $("table.config").empty();
            var a = $.csv.toArrays(config);
            for (var i = 0; i < a.length; i++) {
                var row = a[i];
                var tr = $("<tr>");
                for (var j = 0; j < row.length; j++) {
                    var cell = row[j];
                    var td = $((i === 0 ? "<th>" : "<td>")).text(cell);
                    tr.append(td);
                }
                $("table.config").append(tr);
            }
        });
    };

    var resetGroups = function() {
        var config = ra.get_config(1, 0) || {};
        //set all subjects to group 1 
        //(this is so that matching can be changed per period)
        for (var i = 0; i < ra.subjects.length; i++) { 
            if ($.isArray(config.groups)) {
                for (var groupId = 0; groupId < config.groups.length; groupId++) {
                    if ($.isArray(config.groups[groupId])) {
                        if (config.groups[groupId].indexOf(parseInt(ra.subjects[i].user_id)) > -1) { //Nested group array
                            ra.set_group(groupId + 1, ra.subjects[i].user_id);
                        }
                    } else {
                        ra.set_group(1, ra.subjects[i].user_id);
                    }
                }
            } else {
                ra.set_group(1, ra.subjects[i].user_id);
            }
        }
    };



    Display.initialize();

    ra.on_load(function() {
        resetGroups(); //Assign groups to users
    });

    ra.on_register(function(user) { //Add a row to the table to each user
        resetGroups();
    });

    ra.on("start_session", function() {
        ra.start_session();
    });

    ra.on("pause", function() {
        ra.pause();
    });

    ra.on("resume", function() {
        ra.resume();
    });

    ra.recv("new_period_request", function(uid, msg) {
        /*
        counts the number of messages called and if every subject sent this message, trigger assign_group
         */
            var current_period = msg.current_period;
            console.log("current_period ", current_period);
            if ( current_period > 0 && current_period !== undefined && current_period !== null && !isNaN(current_period) ) {
                console.log("valid msg");
                if ( !per_period_subject_counter[current_period] ) { //if first subject - period information is not existant
                    console.log("first subject has arrived");
                    per_period_subject_counter[current_period] = subject_count;
                }
                console.log(per_period_subject_counter[current_period]);
                if ( --per_period_subject_counter[current_period] == 0 ) { //if we counted down all subjects
                    console.log("last subject has arrived");
                    ra.trigger("assign_group", {current_period : current_period});
                    ra.sendCustom("new_period_called_by_admin", {current_period : current_period});
                }
            }
        }); 

    /*
     ********************
     * Helper functions *
     ********************
     */
    
    // Dedimensionize a given array
    function dedim(arr) {
        var result = [];
        _dedim(arr, result);
        return result;
    }
    function _dedim(arr, result) {
        if (dataTypeOf(arr) == 'array') {
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                _dedim(arr[i], result);
            }
        }
        else {
            result.push(arr);
        }
    }
    // Function that outputs a more specific data type
    function dataTypeOf(data) {
        return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
    }

    // clones an object
    function clone(obj){
        return JSON.parse(JSON.stringify(obj));
    }

}]);