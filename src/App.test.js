import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event'
import App from './App';

test('recebe um novo usuario e mostra na lista', async () => {

    //renderizar o app
    render(<App />)

    //pegar os elementos que iram ter interações
    const nameInput = screen.getByRole('textbox', {name: /name/i}) //i é para case insensitive
    const emailInput = screen.getByRole('textbox', {name: /email/i})
    const button = screen.getByRole('button')

    // listar as ações do usuario
    await user.click(nameInput)
    await user.keyboard('rafael')
    await user.click(emailInput)
    await user.keyboard('rafael@gmail.com')
    await user.click(button)

    //pegar os dados que acabaram de ser adicionados pelo usuario acima
    const name = screen.getByRole('cell', { name: 'rafael'});
    const email = screen.getByRole('cell', { name: 'rafael@gmail.com'});

    //checar se o que fizemos acima esta correto e funcionando
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    //o screen.debug() mostra uma representação do JSX atualizado com as acões do usuario
    // screen.debug()
});
