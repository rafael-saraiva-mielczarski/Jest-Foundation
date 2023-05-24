import {render, screen} from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import RepositoriesListItem from './RepositoriesListItem'


//criar um func que renderiza o component pode ser util quando se teram varios test cases, assim so necessita escrever uma vez e importar para o restante
function renderComponent() {
    const repository = {
        full_name: 'facebook/react',
        language: 'Javascript',
        description: 'JS lib',
        owner: 'facebook',
        name: 'react',
        html_url: 'https://github.com/facebook/react'
    }
    render(
        //como o component q esta sendo testado usa do Link do react router dom, necessita que ele seja envolto pelo memory router, para que nao de erro
        <MemoryRouter>
            <RepositoriesListItem repository={repository}/>
        </MemoryRouter>
    )
}

//Warning do act(), o RTL usa o act() por debaixo dos panos, quando fizer um request q vai mudar o estado do app ele pode demorar e daria um erro que n seria verdadeiro, o act() lida com isso e faz com que nao aconteça o erro, porem mostra um warning, que pode ser contarnado usando um screen.findBy, normalmente n se faz o que a warning diz para fazer
test("mostra um link para a homepage do github desse repositorio", async () => {
    renderComponent()

    await screen.findByRole('img', { name: 'Javascript' })
})

//esssa func serve como workaround para dar um pause de alguns milisegundo no teste, para que o request http possa acontecer sem erro
const pause = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, 100)
    })
}