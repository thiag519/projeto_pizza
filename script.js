const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

let modalQt = 1;
let modalKey = 0;
let cart = [];


pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    /*

    O método Node.cloneNode() duplica um elemento node (nó) da estrutura de um documento DOM.
     Ele retorna um clone do elemento para o qual foi invocado.

    Syntax
    var dupNode = node.cloneNode(deep);
    node
    O elemento node (nó) a ser clonado 'duplicado'.

    dupNode
    O novo elemento node (nó) resultado da clonagem do elemento node.

    deep Optional [1]
    true se os elementos filhos do nó que está sendo clonado devem ser clonados juntos, ou false para clonar apenas o nó específico dispensando,
    assim, qualquer elemento DOM filho. Veja os exemplos abaixo.
    
    */
     
    // prencher as informações em pizzaiten
    pizzaItem.querySelector('.pizza-item--img img ').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML =item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML =item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML =`RS ${item.price.toFixed(2)}`;
    // criar um atributo para indentificar cada elemento do pizzaitem
    pizzaItem.setAttribute('date-key', index);

    //criar um eveto de click que eziba as informações de cada elemento do pizzaitem clicado
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {

        e.preventDefault();// cancela a ação natural da teg a que é carregar a pagina !
        let key = e.target.closest('.pizza-item').getAttribute('date-key');
        /* 
        O método Element.closest() retorna o ancestral mais próximo, em relação ao elemento atual, que possui o seletor fornecido como parâmetro.
          No caso de o elemento atual possuir o seletor, o mesmo é retornado. Caso não exista um ancestral o método retorna .null
         */
        modalQt = 1;
      
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML =`RS ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');

        // forEach: "para cada item" usado para percorrer os elementos        'parecido com o map()'.
        cs('.pizzaInfo--size').forEach((size, indexsize)=> {
            if(indexsize == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[indexsize];
        })
        modalKey = key;// criei para saber qual pizza é

        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.display = 'flex';
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout( ()=> {
            c('.pizzaWindowArea').style.opacity = 1; 
        }, 250);
    })

    c('.pizza-area').append(pizzaItem);
});

// Eventos do MODAL


function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout( ()=> {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);

}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click', closeModal);
});


/*   outras formas 

c('.pizzaInfo--cancelButton').addEventListener('click', closeModal);
c('.pizzaInfo--cancelMobileButton').addEventListener('click', closeModal);

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> item.addEventListener('click', closeModal));
 */

 // Quantidade de pizzas no carrinho                   "aula 8" 01/04/24
 
 
c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if(modalQt > 1) {
        modalQt --;
    }
    c('.pizzaInfo--qt').innerHTML = modalQt;
});


cs('.pizzaInfo--size').forEach((size, indexsize)=> {
    size.addEventListener('click', ()=> {
     c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected'); 
    })
        
});

                 
// Adicionar ao carrinho                    "aula 9" 03/04/24


c('.pizzaInfo--addButton').addEventListener('click', () => {

    // Qual a pizza?
    // Qual o tamanho?
    // Quantas pizzas?

   let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

   // Adicionar ao carrinho                    "aula 10" 04/04/24

   let identifier = pizzaJson[modalKey].id+'@'+size;
   // identifier criado para gerar um comparador do id'indentificaçao da pizza ' e size'tamanho da pizza'
   let key = cart.findIndex((item)=>item.identifier == identifier);
   //findIndex para percorre o array e verificar se o item tem ou nao o id e o size igual  

   if(key > -1) {
        cart[key].quantidade += modalQt;
    // caso seja igual so almenta a quantidade 
    } else {
    // se nao preche como outro item no carrinho
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        tamanho:size,
        quantidade: modalQt
   })
    
   };
   updateCart();
   closeModal();
   
});
// Adicionar ao carrinho                    "aula 11" 06/04/24

c('.menu-openner').addEventListener('click' ,() => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
})

c('.menu-closer').addEventListener('click' ,() => {
    
   c('aside').style.left = '100vw';
    
})

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;

    // se tiver algo no carrinho ele aparece
    if(cart.length > 0) {

        // torno ele visivel se ouver itens no carinho
        c('aside').classList.add('show');
       

        // zero as informações para nao repetir 
        c('.cart').innerHTML = '';

        // crieia as variaves com valor zerados "aula 12" 11/04/24
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // um loop para percorrer o carinho
        for(let i in cart) {

            // conequitando os itens do carrinho ao ao banco de dados jason
            // criando uma variavel para verificar se o id do item do carinho é igual 
            //assim nao repete o mesmo item 
            let pizzaItem = pizzaJson.find((item )=>item.id == cart[i].id);


            // em seguida prenchi o valor da variavel subtotal usando o pizzaItem
            // que estava pegando os dados das pizzas dentro do pizzaJson
            subtotal += pizzaItem.price * cart[i].quantidade;
            
            //cartItem para percorrer os elementos para prencher o carinho
            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName ;

        // Adicionar ao carrinho                    "aula 12" 06/04/24

            // para identificar os tamanhos com p,m,g ao invez de 0,1,2
            switch(cart[i].tamanho) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
                }

            // para unir o nome e o tamanho
            let pizzaName = `${pizzaItem.name}  (${pizzaSizeName}) `;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade;

            //para almentar a quantidade de pizzas dentro do carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].quantidade ++;

                //para atualizar a funçao ao adicionar
                updateCart();
            });

            //para diminuir a quantidade de pizzas dentro do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].quantidade > 1) {
                cart[i].quantidade --;
                }else{

                    //para remover o item do array (i= o item , 1 a quantidade que vai ser removida)
                    cart.splice(i, 1);
                }

                //para atualizar a funçao ao adicionar
                updateCart();
            });

            c('.cart').append(cartItem);
    
        }
        // o desconto vai ser igual 10%  do subtotal
        desconto = subtotal * 0.1;

        //o total vaiser igual ao subtotal menos o desconto(que é 10% do subtotal)
        total = subtotal - desconto;

        // preenchimento dos valores no carinho
        c('.subtotal span:last-child').innerHTML = `RS: ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `RS: ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `RS: ${total.toFixed(2)}`;

        
    } else {
        // feichar o carrinho se nao ouver nada nele
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
    scrollTo(top) ;
};



/*
let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
 switch(size) {
    case size == 0:
        c('.pizzaInfo--actualPrice').innerHTML =`RS ${pizzaJson[modalKey].price.toFixed(2) - 5 }`;
    break;
    case size == 1:
        c('.pizzaInfo--actualPrice').innerHTML =`RS ${pizzaJson[modalKey].price.toFixed(2) - 2.5 }`;
    break;
    case size == 2:
        c('.pizzaInfo--actualPrice').innerHTML =`RS ${pizzaJson[modalKey].price.toFixed(2)}`;
    break;
 }
/*

  pizzaJson.map((x )=> {
                
            switch(x.sizes) {
                
                case  x.sizes[0]:
                    c('.pizzaInfo--actualPrice').innerHTML =`RS ${pizzaJson[key].price - 5 }` - 5
                    console.log('[0]');
                break;
                case   x.sizes[1]:
                    c('.pizzaInfo--actualPrice').innerHTML =`RS ${pizzaJson[key].price - 2 }`  - 2.5
                    console.log('[1]');
                break;
                case   x.sizes[2]:
                    c('.pizzaInfo--actualPrice').innerHTML =`RS ${pizzaJson[key].price}`
                    console.log('[2]');
                break;
            }
        })
*/