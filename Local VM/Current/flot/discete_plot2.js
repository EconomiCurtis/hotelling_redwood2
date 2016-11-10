else {
    //else we are in discrete time
    p2_options.xaxis.tickDecimals = 0;
    p2_options.xaxis.min = 0;
    p2_options.xaxis.max = curr_subperiods + 2;
    p2_options.xaxis.ticks = p2_ticks;

    if (flow_opts == "all") {
        flow_payoff = plot_data(sub_pay[0], 0, 1);
        flow_payoff2 = plot_data(sub_pay[1], 0, 1);

        //set player's payoff bar graphs to have 25% opacity
        if (network.players[0].id == id) filler = [0.25, 0];
        else if (network.players[1].id == id) filler = [0, 0.25];

        plot2 = $.plot("#placeholder2", [{
            data: flow_payoff,
            color: player_color(network.players[0].id),
            points: {
                show: false,
                radius: 4,
                fill: true,
                fillColor: '#C7C7C7'
            },
            lines: {
                fill: filler[0]
            }
        }, {
            data: flow_payoff2,
            color: player_color(network.players[1].id),
            points: {
                show: false,
                radius: 4,
                fill: true,
                fillColor: '#C7C7C7'
            },
            lines: {
                fill: filler[1]
            }
        }], p2_options);
    }
}