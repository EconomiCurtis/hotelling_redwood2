if (game_type == "continuous") {
    //make sure everyone is sorted
    sort_players();
    find_intersect_pts();

    //so we can get the correct payoffs
    var index = get_index_by_id(id);
    var pay = payoff(index);
    rs.send("update_payoff", {
        pay: pay,
        index: index
    });

    let's find how long it was since we updated our payoffs      
    date = new Date();
    date.getTime();
    var d = date - old_date;
    old_date = date;

    //p2_t += d; //faulty for some reason
    p2_t += 0.12; //x-axis (time)

    cummulative_payoff += network.players[get_index_by_id(id)].payoff * (d / (period_length * 1000));
    console.log("cummulative_payoff: ", cummulative_payoff);

    document.getElementById("curr_score").innerHTML = "Current score: " + cummulative_payoff.toFixed(3);

    if (flow_opts == "all") {
        //push all player's data to be plotted
        flow_payoff.push([p2_t, network.players[get_index_by_id(in_group[0])].payoff]);
        flow_payoff2.push([p2_t, network.players[get_index_by_id(in_group[1])].payoff]);

        total_flow.push([p2_t, network.players[get_index_by_id(in_group[0])].payoff]);
        total_flow2.push([p2_t, network.players[get_index_by_id(in_group[1])].payoff]);

        //add extra white space to front of plot to hide end time
        p2_options.xaxis.max = flow_payoff[flow_payoff.length - 1][0] + 5;

        last_20.push(network.players[get_index_by_id(in_group[0])].payoff);
        last_20.push(network.players[get_index_by_id(in_group[1])].payoff);

        //get rid of data more than 20seconds old
        if (time >= 20) {
            flow_payoff.shift();
            flow_payoff2.shift();
            last_20.shift();
            p2_options.xaxis.min = flow_payoff[0][0];
        }

        //scale flow payoff y axis to fit m ax payoff during the last 20 seconds 
        p2_options.yaxis.max = Math.max.apply(null, last_20) * 1.1;

        plot2 = $.plot("#placeholder2", [{
            data: flow_payoff,
            color: player_color(network.players[get_index_by_id(in_group[0])].id),
            points: {
                show: false,
                radius: 4,
                fill: true,
                fillColor: '#C7C7C7'
            }
        }, {
            data: flow_payoff2,
            color: player_color(network.players[get_index_by_id(in_group[1])].id),
            points: {
                show: false,
                radius: 4,
                fill: true,
                fillColor: '#C7C7C7'
            }
        }], p2_options);
    }
}