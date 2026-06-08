//// Semi AI Generated
class PseudoRandom 
{
	#a
	#c
	#mod
	#aInv
	#firstSeed
	#seed
    constructor(seed) 
	{
        this.#a = 1664525n;
        this.#c = 1013904223n;
        this.#mod = 2n ** 32n;

        // modular inverse of 1664525 mod 2^32
        this.#aInv = 4276115653n;

        this.#firstSeed =
            seed == null || seed === 0
                ? BigInt(Math.floor(Math.random() * 2 ** 32))
                : BigInt(seed);

        this.#seed = this.firstSeed;
    }
	
	IsSeedFirst()
	{
		return this.#seed == this.#firstSeed;
	}

    Next() 
	{
        this.#seed = (this.#a * this.#seed + this.#c) % this.#mod;
        return this.#seed;
    }

    Prev() 
	{
		if (IsSeedFirst()) return this.#seed; // so you cant go to the seed before the first one
			
        this.seed =
            (this.#aInv * ((this.#seed - this.#c + this.#mod) % this.#mod))
            % this.#mod;
        return this.#seed;
    }
}
/////////////////
cardImg = document.getElementById("card_img");
previousBtn = document.getElementById("previous");
rerollBtn = document.getElementById("reroll");

MyRand = new PseudoRandom(null);

let cardDB;
(async () => {
	response = await fetch(
		"https://api.scryfall.com/bulk-data/oracle-cards"
	)
	response.json().then(async data => {
		json_download = await fetch(data.download_uri);
		json_download.json().then(all_cards_data => {
			cardDB = all_cards_data;
			rerollBtn.innerHTML = "Reroll Commander";
			rerollBtn.removeAttribute("disabled");
			previousBtn.innerHTML = "Previous Commander";
		});
	});
	/*response.json().then(data => {
		cardDB = data;
		rerollBtn.innerHTML = "Reroll Commander";
		rerollBtn.removeAttribute("disabled");
	});*/
})();

function GetNextRandomCard()
{
	// Enable the previous Button
	previousBtn.removeAttribute("disabled");
	let randIndex = Math.floor((cardDB.length-1)*MyRand.Next());
	return cardDB[randIndex];
}

function GetPreviousRandomCard()
{
	let randIndex = Math.floor((cardDB.length-1)*MyRand.Prev());
	if (MyRand.IsFirstSeed() && !previousBtn.hasAttribute("disabled")) 
	{
		//If we back to starting rng seed, disable previous button
		previousBtn.toggleAttribute("disabled");
	}
	return cardDB[randIndex];
}

function IsCommander(card)
{
	return !card.type_line.includes("Token") 
		&& card.type_line.includes("Legendary Creature")
		&& card.legalities.commander == "legal";
}

rerollBtn.addEventListener("click", () => {
	/*const response = await fetch(
        "https://api.scryfall.com/cards/random"
    );

    const data = await response.json();
	cardImg.src = data.image_uris.png;

    console.log(data);*/
	/*const response = await fetch(
		"https://data.scryfall.io/oracle-cards/oracle-cards-20260606210404.json"
	);

	const data = await response.json();
	console.log(response);
	console.log(data);*/
	
	let card = GetNextRandomCard();
	while (!IsCommander(card))
	{
		card = GetNextRandomCard();
	}
	console.log(card);
	cardImg.src = card.image_uris.png;
});

previousBtn.addEventListener("click", () => {	
	let card = GetPreviousRandomCard();
	while (!IsCommander(card))
	{
		card = GetPreviousRandomCard();
	}
	console.log(card);
	cardImg.src = card.image_uris.png;
});

function main()
{
	var affirmation = prompt("Welcome to Random MTG Commander!\nTo use this site, please affirm your love for me by entering\n\"I Love Sam Browning\"\nin the box below");
	if (affirmation.toLowerCase() != "i love sam browning") 
	{
		alert("Wrong!");
		window.close();
	}
	else
	{
		alert("Good Boy/Girl/Differently Gendered Person");
	}
}

main();