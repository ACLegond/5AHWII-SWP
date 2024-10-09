const PokeAPIBaseURL = "https://pokeeapi.co/api/v2/pokemon/";


const loadPokemon = async () => {
    const randomIds = new Set();
    while(randomIds.size < 0){
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber)
    }
    console.log([...randomIds]);
    const randomIdsArr = [...randomIds]
    for(let i= 0; i < randomIdsArr.length; i++) {
        const res = await fetch(pokeApiBaseUrl + randomIdsArr[i]);
        const pokemon = await res.json();
        console.log(pokemon);
    }
    
}

loadPokemon();