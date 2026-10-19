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
                ? Math.floor(Math.random() * 2 ** 32)
                : seed;

        this.#seed = this.#firstSeed;
    }
	
	IsSeedFirst()
	{
		return this.#seed == this.#firstSeed;
	}

    Next() 
	{
		/*console.log(typeof(this.#a));
		console.log(typeof(this.#seed));
		console.log(typeof(this.#c));
		console.log(typeof(this.#mod));
		console.log(typeof(this.#firstSeed));*/
        this.#seed = Number((this.#a * BigInt(this.#seed) + this.#c) % this.#mod);
        return this.#seed / Number(this.#mod);
    }

    Prev() 
	{
		if (this.IsSeedFirst()) return this.#seed / Number(this.#mod); // so you cant go to the seed before the first one
			
        this.#seed =
            Number((this.#aInv * ((BigInt(this.#seed) - this.#c + this.#mod) % this.#mod))
            % this.#mod);
        return this.#seed / Number(this.#mod);
    }
}
/////////////////
cardImg = document.getElementById("card_img");
previousBtn = document.getElementById("previous");
rerollBtn = document.getElementById("reroll");
cardAmountInp = document.getElementById("card_amount");

MyRand = new PseudoRandom(null);

async function DecompressBlob(blob) {
    const ds = new DecompressionStream("gzip");
    const decompressedStream = blob.stream().pipeThrough(ds);
    return new Response(decompressedStream);
}

(async () => {
    const response = await fetch(
        "https://api.scryfall.com/bulk-data/oracle-cards"
    );

    const metadata = await response.json();

    const compressedResponse = await fetch(metadata.jsonl_download_uri);

    const decompressedResponse =
        await DecompressBlob(await compressedResponse.blob());

    text = await decompressedResponse.text()
    cardDB = text.trim().split("\n").map(line => JSON.parse(line));

    rerollBtn.innerHTML = "Reroll Commander";
    rerollBtn.removeAttribute("disabled");
    previousBtn.innerHTML = "Previous Commander";
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
	if (MyRand.IsSeedFirst() && !previousBtn.hasAttribute("disabled")) 
	{
		//If we back to starting rng seed, disable previous button
		previousBtn.toggleAttribute("disabled");
	}
	return cardDB[randIndex];
}

function IsValidCommander(card)
{
	function _IsValidCardType(card)
	{
		if (IsDoubleSided(card))
		{
			return _IsValidCardType(card.card_faces[0]) || _IsValidCardType(card.card_faces[1]);
		}
		try {
			return (card.type_line.includes("Legendary")
				&& card.hasOwnProperty("power"))
			|| (card.type_line.includes("Planeswalker") && card.oracle_text.includes("can be your commander"));
		} catch {console.log("ASDIUHASFIUBSD", card);}
	}
	return !card.type_line.includes("Token") 
		&& card.legalities.commander == "legal" 
		&& _IsValidCardType(card)
		&& card.layout != "meld"
		&& (!IsDoubleSided(card) || _IsValidCardType(card.card_faces[0]));
}

function IsDoubleSided(card)
{
	return card.layout == "flip" || card.layout == "modal_dfc" || card.layout == "transform";
}

function GetCardImage(card)
{
	if (IsDoubleSided(card))
	{
		console.log("FISUDHBFIUYSBDF");
		return card.card_faces[0].image_uris.png;
	}
	return card.image_uris.png;	
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
	while (!IsValidCommander(card))
	{
		card = GetNextRandomCard();
	}
	console.log(card);
	cardImg.src = GetCardImage(card);
});

previousBtn.addEventListener("click", () => {	
	let card = GetPreviousRandomCard();
	while (!IsValidCommander(card))
	{
		card = GetPreviousRandomCard();
	}
	console.log(card);
	cardImg.src = GetCardImage(card);
});

function main()
{
	var affirmation = prompt("Welcome to Random MTG Commander!\nTo use this site, please affirm your love for me by entering\n\"I Love Sam Browning\"\nin the box below");
	if (affirmation.toLowerCase() != "i love sam browning") 
	{
		alert("Wrong!");
		window.location.href = "https://google.com";
	}
	else
	{
		alert("Good Boy/Girl/Differently Gendered Person");
	}
}

//main();