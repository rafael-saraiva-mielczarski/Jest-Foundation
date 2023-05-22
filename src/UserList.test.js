import { render, screen, within } from '@testing-library/react'
import UserList from './UserList'

function renderComponent() {
    const users = [
        { name: 'rafael', email: 'rafael@gmail.com'},
        { name: 'roberta', email: 'roberta@gmail.com'},
    ];
    render(<UserList users={users} />);

    return {
        users,
    }
}

test("renderiza uma linha por usuario", () => {
    //renderiza o component
    const users = [
        { name: 'rafael', email: 'rafael@gmail.com'},
        { name: 'roberta', email: 'roberta@gmail.com'},
    ]
    const { container } = render(<UserList users={users} />)

    // screen.logTestingPlaygroundURL() esse comando linka para um site onde é possivel visualizar o html e retorna um comando para seleção, como o abaixo

    //achar todas linhas da tabela USANDO o --getByTestId-- é um prop de atributo que se utiliza no JSX do código, pegando as linhas que estão dentro do elemento HTML que contem o data-test-id
    // const rows = within(screen.getByTestId('users')).getAllByRole('row')

    //achar todas linhas da tabela sem alterar o codigo JSX, usando o metodo de container
    const rows = container.querySelectorAll('tbody tr')

    //assert que teram x linhas
    expect(rows).toHaveLength(2)
})

test("renderiza o email e nome do usuario", () => {
    //renderiza o component, deestruturando o objeto que nos é passado
    const { users } = renderComponent()

    //loop para descobrir se o nome e email do usuario estao no corretos, com o loop é possivel iterar entre os objetos e não ter que escrever todos os nomes e email de cada um
    for (let user of users) {
        const name = screen.getByRole('cell', { name: user.name});
        const email = screen.getByRole('cell', { name: user.email});

        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
    }
})