const createAutoComplete = ({ 
    root, 
    renderOptions, 
    onOptionSelect, 
    inputValue,
    fetchData
}) => {
    
root.innerHTML = `
<label><b>Search</b></label>
<input class="input" />
<div class ="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
            
      </div>
    </div>
</div>
`

const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

const onInput = async event => {
    const items = await fetchData(event.target.value);

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    if(!items){
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = `No Movies Named '${input.value}'`
            resultsWrapper.appendChild(option)
            return;
        }

    for(let item of items)    {
        const option = document.createElement('a');

        option.classList.add('dropdown-item');
        option.innerHTML = renderOptions(item);

        option.addEventListener('click', ()=>{
            dropdown.classList.remove("is-active");
            input.value = inputValue(item);
            onOptionSelect(item);
        })

        resultsWrapper.appendChild(option);
    }
};

input.addEventListener('input',debounce(onInput,1000));

document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove("is-active");
    }
})
}