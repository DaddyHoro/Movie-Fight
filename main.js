const dateIndivid = {
    nume: "Popescu",
    prenume: "Marian",
    varsta: "54"
}

const dateAltIndivid = {...dateIndivid}

console.log(dateAltIndivid)

dateIndivid.nume = "Gherge"

console.log(dateIndivid)
console.log(dateAltIndivid)