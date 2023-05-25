import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import HomeRoute from './HomeRoute';
import { createServer } from '../test/server';

//QUANDO FOR TESTAR UM COMPONENTE QUE TEM DATA FETCHING, SEMPRE ANALISAR QUAL O TIPO DE DADO QUE ESTAMOS BUSCANDO POIS TEM Q RETORNAR ALGUM TIPO DE DADO QUE SEJA PARECIDO QUE POSSAMOS TESTAR, E TAMBEM AJEITAR ESSE DADO PARA QUE SEJA ALGO TESTAVEL E RELEVANTE. ESSE EH O PRIMEIRO PASSO PARA QUALQUER TESTE COMO REQUESTS

createServer([
    {
        path: '/api/repositories',
        res: (req) => {
            const language = req.url.searchParams.get('q').split('language:')[1]
            return {
                items: [
                    { id: 1, full_name: `${language}_one` },
                    { id: 2, full_name: `${language}_two` },
                ]
            }
        }
    }
])

const handlers = [
    //esse func observa todos os requests q foram feitos no ambiente de teste e interceptar todos os GETS que forem feitos para a url
    rest.get('/api/repositories', (req, res, ctx) => {
        //pegar o query que foi usado 
        const language = req.url.searchParams.get('q').split('language:')[1]
        console.log(language)

        //simular a response do request atraves desse codigo
        return res (
            //ctx = context
            //devolver um objeto que seja igual ao que recebemos da api, aqui so usamos os campos que iremos testar
            ctx.json({
                items: [
                    { id: 1, full_name: `${language}_one` },
                    { id: 2, full_name: `${language}_two` },
                ]
            })
        )
    })
]

const server = setupServer(...handlers)

//essas tres func sao built in do jest
//acontece uma vez antes de todos os testes desse arquivo rodarem
beforeAll(() => {
    //antes do testes comecarem para o servidor iniciar e comecar a ouvir os requests
    server.listen()
})
//acontece uma vez depois de cada um dos testes rodarem, independete de passar ou falhar
afterEach(() => {
    //reseta os valores do handlers para seu valor inicial depois de cada teste
    server.resetHandlers()
})
//acontece uma vez depois de todos os testes rodarem
afterAll(() => {
    //fechar o servidor
    server.close()
})


test('renderiza dois links para cada linguagem', async () => {
    render(
        <MemoryRouter>
            <HomeRoute />
        </MemoryRouter>
    )

    //loop em cada linguagem, ter certeza q cada um tem os dois links e assegurar que os links tem o full name certo
    const languages = [
        'javascript',
        'typescript',
        'rust',
        'go',
        'python',
        'java'
    ];

    for (let language of languages) {
        const links = await screen.findAllByRole('link', { name: new RegExp(`${language}_`)})

        expect(links).toHaveLength(2);
        //testar cada link pegando seu index e ver se seu conteudo de texto eh equivalente ao param
        expect(links[0]).toHaveTextContent(`${language}_one`)
        expect(links[1]).toHaveTextContent(`${language}_two`)
        //mesma coisa so que ver se tem um atributo com o valor esperado
        expect(links[0]).toHaveAttribute('href', `/repositories/${language}_one`)
        expect(links[1]).toHaveAttribute('href', `/repositories/${language}_two`)
    }
})