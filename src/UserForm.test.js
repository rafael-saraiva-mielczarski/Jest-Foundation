import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import UserForm from './UserForm'

//test é fornecido pelo jest, a frase entre '' é um descrição da func de teste
test('it show two inputs and a button', () => {
    //renderizar o componente
    render(<UserForm />) 
    //se quiser passar props so escrever direto render(<UserForm name="rafa"/>)

    //manipular o componente ou achar um elemento nele
    const inputs = screen.getAllByRole('textbox');
    const button = screen.getAllByRole('button')

    //Assertition - ter certeza que o componente ta fazendo o que é para fazer
    expect(inputs).toHaveLength(2);
    expect(button).toHaveLength(1);
})

//se o teste for ter qualquer uso de USER, precisa ser uma func async e await em qualquer chamada de user.x
test('chama onUserAdd quando o form é enviado', async () => {
    //mock vem builtin do jest, é um func "fake", que serve para simular o chamado da func
    const mock = jest.fn();
    //renderizar o componente
    render(<UserForm onUserAdd={mock}/>)

    //encontrar os inputs
    //se o campo no JSX tiver htmlFor e id iguais, pode se encontrar o elemento dessa maneira
    const nameInput = screen.getByRole('textbox', {name: /name/i})
    const emailInput = screen.getByRole('textbox', {name: /email/i})

    //simular a escrita de um nome
    await user.click(nameInput)
    await user.keyboard('rafael')

    //simular a escrita de um email
    await user.click(emailInput)
    await user.keyboard('rafael@gmail.com')

    //achar o botao de submit
    const button = screen.getByRole('button')

    //simular o clique
    await user.click(button)

    // Confirmar se o onUserAdd foi chamado com os valores de email e name
    expect(mock).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledWith({name: 'rafael', email: 'rafael@gmail.com'});
})


//Um pouco de Test Driven Development
//primeiro foi escrito o teste e depois feito a implementaçao da feature
test('limpa os campos de inputs apos o formulario ser enviado', async () => {
    render(<UserForm onUserAdd={() => {}}/>)

    const nameInput = screen.getByRole('textbox', {name: /name/i})
    const emailInput = screen.getByRole('textbox', {name: /email/i})
    const button = screen.getByRole('button')

    await user.click(nameInput)
    await user.keyboard('rafael')

    //simular a escrita de um email
    await user.click(emailInput)
    await user.keyboard('rafael@gmail.com')

    //simular o clique
    await user.click(button)

    //resetar os valores dos campos, de primeira esse teste falhara
    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
})