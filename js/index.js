$(document).ready(function(){
    let colors = {
        black: '#000',
        blue: '#00f',
        brown: '#654321',
        gray: '#808080',
        green: '#0F0',
        pink: '#FFC0CB',
        purple: '#800080',
        red: '#F00',
        white: '#FFF',
        yellow: '#ff0'
    },
    nc = nearestColor.from(colors);
    const P = new Pokedex.Pokedex(),
        generatedColorElm = $("#generatedColor"),
        generatedPokemonElm = $("#generatedPokemon");

    $("#getColor").click(function(){
        let self = this;
        $(self).addClass("loading");
        $.get('https://api.noopschallenge.com/hexbot', function(data){
            if(data.colors) {
                let color = data.colors[0].value;
                let nearest = nc(color);
                P.getPokemonColorByName(nearest.name)
                    .then(function(response){
                        if(response.pokemon_species) {
                            let randomKey = Math.floor(Math.random() * response.pokemon_species.length);
                            let pokemonName = response.pokemon_species[randomKey].name;
                            P.getPokemonByName(pokemonName)
                                .then(function(response) {
                                    let image = response.sprites.front_default;
                                    generatedPokemonElm.html("<img src='" + image + "' alt='" + pokemonName + "' />" +
                                        "<h3 class='pokemon-name'>" + pokemonName + "</h3>");
                                    generatedColorElm.text(color);
                                    $(self).removeClass("loading");
                                }).catch(function() {
                                    $(self).removeClass("loading");
                                });
                        }
                    }).catch(function() {
                        $(self).removeClass("loading");
                    })
            }
        }).fail(function() {
            $(self).removeClass("loading");
        })
    })
});