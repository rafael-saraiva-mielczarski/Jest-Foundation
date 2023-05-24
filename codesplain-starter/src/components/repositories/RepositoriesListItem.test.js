import {render, screen, act, findByRole } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import RepositoriesListItem from './RepositoriesListItem'

//esses testes giram em torno do ACT() WARNING e maneira de passar sobre ele, o melhor jeito de superar esse warning é pelo uso do findBy. Usar o jest.mock para sonegar o compenente e utilizar uma string no lugar também é uma possibilidade, mas n é o mais recomendado. Por fim, usar o act do rtl com um pause func é a menos recomendada.

//usando o jest.mock desse jeito, ele vai impedir que o component FileIcon seja renderizarado e retornar uma string de file icon component
// jest.mock('../tree/FileIcon', () => {
//     //esse eh o conteudo do file icon inves de ser o componente real
//     return () => {
//         return 'File Icon Component'
//     }
// })

//criar um func que renderiza o component pode ser util quando se teram varios test cases, assim so necessita escrever uma vez e importar para o restante
function renderComponent() {
    const repository = {
        full_name: 'facebook/react',
        language: 'Javascript',
        description: 'JS lib',
        owner: {
            login: 'facebook',
        },
        name: 'react',
        html_url: 'https://github.com/facebook/react'
    }
    render(
        //como o component q esta sendo testado usa do Link do react router dom, necessita que ele seja envolto pelo memory router, para que nao de erro
        <MemoryRouter>
            <RepositoriesListItem repository={repository}/>
        </MemoryRouter>
    )

    //retorna o objeto repository, podendo ser deestruturado no test case.
    return { repository }
}

//Warning do act(), o RTL usa o act() por debaixo dos panos, quando fizer um request q vai mudar o estado do app ele pode demorar e daria um erro que n seria verdadeiro, o act() lida com isso e faz com que nao aconteça o erro, porem mostra um warning, que pode ser contarnado usando um screen.findBy, normalmente n se faz o que a warning diz para fazer
test("mostra um link para a homepage do github desse repositorio", async () => {
    const { repository } = renderComponent()

    await screen.findByRole('img', { name: 'Javascript' })

    const link = screen.getByRole('link', { name: /github repository/i })
    //deestruturando o objeto, conseguimos setar dinamicamente o dado que deve ser pego
    expect(link).toHaveAttribute('href', repository.html_url)

    //usando essa implementação o warning some, porém é a menos recomendada de todas
    // await act(async() => {
    //     await pause()
    // })
})

//como lida com request http, o test tem q ser async e await onde iremos pegar o elemento da chamada
test('mostra o fileicon com o icon apropriado', async () => {
    renderComponent()

    const icon = await screen.findByRole('img', { name: 'Javascript' })

    expect(icon).toHaveClass('js-icon')
})

test('mostra link para a pagina de editor do codigo', async () => {
    const {repository} = renderComponent()

    await screen.findByRole('img', { name: 'Javascript' })

    const link = await screen.findByRole('link', { name: new RegExp(repository.owner.login) })

    expect(link).toHaveAttribute('href', `/repositories/${repository.full_name}`)
})

//esssa func serve como workaround para dar um pause de alguns milisegundo no teste, para que o request http possa acontecer sem erro
const pause = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, 100)
    })
}