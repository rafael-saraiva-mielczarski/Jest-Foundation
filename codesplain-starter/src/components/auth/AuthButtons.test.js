import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { createServer } from "../../test/server";
import AuthButtons from './AuthButtons'

//PRIMEIRA COISA A SE FAZER EH ANALISAR COMO FUNCIONA A API DE AUTH, SUAS RESPOSTAS E O QUE RETORNA

async function renderComponent() {
    render(
        <MemoryRouter>
            <AuthButtons />
        </MemoryRouter>
    )
    await screen.findAllByRole('link')
}

//usando o describe, podemos criar o servidor e fechado de acordo com os testes que queremos rodar, criamos o servidor uma vez e ele atua no primeiro describe, quando finalizado ele fecha o servidor e cria o servidor para o proximo describe
//o describe tambem ajuda a fazer nesting de testes, ele agrupa os testes que são de mesmo interesse e escopa, como foi falado acima, o beforeAll, beforeEach e afterAll
describe('quando o usuario nao estiver logado', () => {
    // createServer() --> GET '/api/user' --> {user: null}
    createServer([
        {
            path: '/api/user',
            res: () => {
                return { user: null}
            }
        }
    ])
    test('sign in e sgin up ficar visivel', async() => {
        await renderComponent()

        const signInButton = screen.getByRole('link', {
            name: /sign in/i
        })

        const signUpButton = screen.getByRole('link', {
            name: /sign up/i
        })

        expect(signInButton).toBeInTheDocument();
        expect(signInButton).toHaveAttribute('href', '/signin')

        expect(signUpButton).toBeInTheDocument();
        expect(signUpButton).toHaveAttribute('href', '/signup')
    })

    test('sign ou nao pode ficar visivel', async() => {
        await renderComponent()
        const signOutButton = screen.queryByRole('link', {
            name: /sign out/i
        })

        expect(signOutButton).not.toBeInTheDocument()
    })
})

describe.only('quando o usuario estiver logado', () => {
    // createServer() --> GET '/api/user' --> {user: { id: 1, email: 'test@test.com' }}
    createServer([
        {
            path: '/api/user',
            res: () => {
                return { user: { id: 3, email: 'test@test.com'}}
            }
        }
    ])

    test('sign in e sign up nao pode ficar visivel', async() => {
        await renderComponent()

        const signInButton = screen.queryByRole('link', {
            name: /sign in/i
        })

        const signUpButton = screen.queryByRole('link', {
            name: /sign up/i
        })

        expect(signInButton).not.toBeInTheDocument();
        expect(signUpButton).not.toBeInTheDocument();
    })

    test('sign out tem que ficar visivel', async() => {
        await renderComponent()

        const signOutButton = screen.getByRole('link', {
            name: /sign out/i
        })

        expect(signOutButton).toBeInTheDocument()
        expect(signOutButton).toHaveAttribute('href', '/signout')
    })
})