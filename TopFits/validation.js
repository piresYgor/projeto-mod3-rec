class Validator{
    constructor(){
        this.validations = [
        'data-required',
        'data-min-length',
        'data-email-validate',
        'data-only-letters',
        ]
    }

// iniciar a vaidação de todos os campos
validate(form){

    // resgata todas as validações
    let currentValidations = document.querySelectorAll('form .error-validation');

    if(currentValidations.length > 0){
        this.cleanValidations(currentValidations);
    }

    // pegar os inputs
    let inputs = form.getElementsByTagName('input');

    // transformo HTMLCollection -> array
    let inputsArray = [...inputs];


    // loop nos inputs e validação mediante ao que for encontrado
    inputsArray.forEach(function(input){

        //loop em todas as validações existentes
        for(let i = 0; this.validations.length > i; i++) {
            // verifica se a validação atual existe no input
            if(input.getAttribute(this.validations[i])  != null){
                
                // limpando a string para virar um método
                let method = this.validations[i].replace('data-', '').replace('-', '');

                // valor do input
                let value = input.getAttribute(this.validations[i]);

                //invocar o método
                this[method](input, value);
            }
        }
    }, this);

}


// verifica se o input tem um número mínimo de caracteres
minlength(input, minValue){
    let inputLength = input.value.length;

    let errorMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;

    if(inputLength < minValue){
        this.printMessage(input, errorMessage);
    }
}

//valida emails
emailvalidate(input){
    // email@email.com -> email@email.com.br
    let re = /\S+@\S+\.\S+/;

    let email = input.value;
    
    let errorMessage = `Insira um e-mail no padrão mcfit's@email.com`;

    if(!re.test(email)){
        this.printMessage(input, errorMessage);
    }
}

// valida se o campo tem apenas letras
onlyletters(input){

    let re = /^[A-Za-z]+$/;

    let inputValue = input.value;

    let errorMessage = `Este campo não aceita números nem caracteres especiais`;

    if(!re.test(inputValue)){
        this.printMessage(input, errorMessage);
    }
}

// método para imprimir mensagem de erro na tela
printMessage(input, msg){

    // quantidade de erros
    let errosQty = input.parentNode.querySelector('.error-validation');

    if(errosQty === null){
          let template = document.querySelector('.error-validation').cloneNode(true);

    template.textContent = msg;

    let inputParent = input.parentNode;

    template.classList.remove('template');

    inputParent.appendChild(template);
    }

  
}

// verifica se o input é requerido
required(input){
    let inputValue = input.value;

    if(inputValue === ``){
        let errorMessage = `Este campo é obrigatório`;

        this.printMessage(input, errorMessage);
    }
}

// limpa as validações da tela
cleanValidations(validations){
    validations.forEach(el => el.remove());
}

}


let form = document.getElementById("register-form");
let submit = document.getElementById("submit");

let validator = new Validator();

//evento que faz a validação 

submit.addEventListener('click', function(e){

    e.preventDefault();

    validator.validate(form);

});

// API CEP

const addressForm = document.querySelector('#register-form');
const cepInput = document.querySelector('#cep');
const addressInput = document.querySelector('#rua');
const cityInput = document.querySelector('#cidade');
const neighborhoodInput = document.querySelector('#bairro');
const regionInput = document.querySelector('#região');
const formInputs = document.querySelectorAll('[data-input]');

const closeButton = document.querySelector('#close-message');

const fadeElement = document.querySelector("#fade");

//validação de CEP no input

cepInput.addEventListener("keypress", (e) => {
    const onlyNumbers = /[0-9]|\./;
    const key = String.fromCharCode(e.keyCode);

    // permitir apenas números
    if(!onlyNumbers.test(key)){
        e.preventDefault();
        return;
    }
});

//ativar o evento do endereço

cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;

    //verificamos se está correto
    if(inputValue.length === 8){
        getAddress(inputValue);
    }
});

//obter o endereço pelo API

const getAddress = async (cep) => {
    toggleLoader();
    
    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    //verificar se o cep está errado

    if(data.erro === "true"){
        if(!adrressInput.hasAttribute("disabled")){
            toggleDisabled();
        }
        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP inválido, tente novamente.");
        return;
    }

    if(addressInput.value === ""){
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighborhoodInput.value = data.bairro;
    regionInput.value = data.uf;

    toggleLoader();
};

const toggleDisabled = () =>{
    if(regionInput.hasAttribute("disabled")){
        formInputs.forEach((input) => {
            input.removeAttribute("disabled");
        })
    }else{
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled");
        })
    }
}

//ocultar ou exibir o loader

const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
};

//exibir a mensagem

const toggleMessage = (msg) =>{
    const messageElement = document.querySelector("#message");

    const messageElementText = document.querySelector("#message p");

    messageElementText.innerText = msg;
    
    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
}

closeButton.addEventListener("click", () => toggleMessage());

addressForm.addEventListener("submit", (e) => {
    e.preventDefault();

    toggleLoader();

    setTimeout(() => {

        toggleLoader();

        toggleMessage("Cadastro realizado com sucesso!");

        addressForm.reset();

        toggleDisabled();

    }, 1500);
});